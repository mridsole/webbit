// module for the state of the graph
( function () {

  var graphState = angular.module('graphState', [ ]);

  // SERVICE for dealing with the curren state of the graph
  // used for accessing nodes by ID, requesting updates, etc
  // really, this SHOULDN'T depend on viewState
  // 'updateNodesInView' shouldn't be in here
  graphState.factory('graphState', ['graphStateAPI', function (graphStateAPI) {

    var graphState = {
      nodes: [],
      nodeMap: {},
      watch: null
    };

    // get CURRENTLY LOADED node by ID
    graphState.getNodeByID = function (id) {
      return this.nodes[this.nodeMap[id]];
    };

    // do the initial data fetch, and make a watch and start polling
    graphState.init = function (loc, radius, viewTransform, callback) {

      var watchCallback = function (response) {

        // add any new nodes for display
        var nodes = response.nodes;
        for (var i = 0; i < nodes.length; i++) {
          graphState.addNodeDisplay(nodes[i]);
        }
        // bind local coords
        viewTransform.g2l_batch(nodes);

        console.log(graphState.nodes);
      }

      // first get all the nodes around the area
      this.updateNodes(loc, radius, viewTransform, function (data) {

        // get the IDs of the nodes
        var ids = [];
        for (var i = 0; i < graphState.nodes.length; i++) {
          ids.push(graphState.nodes[i]._id);
        }

        graphStateAPI.makeWatch(
          [{ loc: loc, radius: radius }],
          ids,
          function (watch) {
            graphState.watch = watch;
            callback(data, watch);
          },
          watchCallback
        );
      });
    };

    graphState.updateNodes = function (loc, radius, viewTransform, callback) {

      graphStateAPI.getInRadius(loc, radius, function (res) {
        // update the node map
        for (var i = 0; i < res.data.nodes.length; i++) {
          graphState.addNodeDisplay(res.data.nodes[i]);
        };

        // add local coordinate information to the new data
        viewTransform.g2l_batch(graphState.nodes);

        if (callback != undefined && callback != null) {
          callback(res.data.nodes);
        }
      });
    };

    // add a node to the database and display it
    graphState.addNode = function (node, callback) {

      graphStateAPI.newNode(node, function (res) {
        // update the nodes array and nodeMap
        graphState.addNodeDisplay(res.data.node);
        callback(graphState.getNodeByID(res.data.node._id));
      });
    };

    // add a node for clientside display
    graphState.addNodeDisplay = function(node) {
      // check if it already exists
      if (graphState.nodeMap[node._id] != undefined) { return -1; console.log('dupe!'); }
      // otherwise add it
      graphState.nodeMap[node._id] = graphState.nodes.length;
      graphState.nodes.push(node);
    };

    return graphState;

  }]);

  // SERVICE API for communicating with the node server
  graphState.factory('graphStateAPI', ['$http', function ($http) {

    // watch constructor
    function Watch (points, ids) {
      // ID is retrevied in callback
      this._id = null;
      // array of { loc: ... , radius: ... } objects that specify a geometric condition
      // initialize empty
      this.points = points != undefined ? points : [];
      // array of mongo ids that represent all the nodes stored
      // this specifies a relational condition
      // initialize empty
      this.ids = ids != undefined ? ids : [];

      this.reset = function (points, ids) {
        // clear currently stored points and ids
        this.points.length = 0;
        this.ids.length = 0;
        this.update(points, ids);
      };

      this.update = function (points, ids) {
        for (point in points) { this.points.push(point); }
        for (node in ids) { this.ids.push(node); }
      };

      this.remove = function (points, ids) {

      }
    }

    // export this
    var graphStateAPI = {};

    graphStateAPI.getInRadius = function (loc, radius, callback) {

      var headers = { 'Content-Type': 'application/json' };
      var params = { x: loc[0], y: loc[1], r: radius };
      $http.get('/api/nodes/around', { headers: headers, params: params } )
      .success(callback);
    };

    graphStateAPI.newNode = function (node, callback) {

      // var headers = { 'Content-Type': 'application/json' };
      var params = { }
      $http.post('/api/nodes/new', node).success(callback);
    };

    graphStateAPI.makeWatch = function (points, ids, callback, pollCallback) {

      var watch = new Watch(points, ids);

      var headers = { 'Content-Type': 'application/json' };
      $http.post('/api/watches/new', { watch: watch }).success(function (res) {

        watch._id = res.data._id;

        var params = { _id: watch._id };

        var onPoll = function (res) {
          pollCallback(res.data);
          $http.get('/api/watches/longpoll', { headers: headers, params: params }).success(onPoll);
        }

        // start polling!
        $http.get('/api/watches/longpoll', { headers: headers, params: params }).success(onPoll);

        callback(watch);
      });
    };

    return graphStateAPI;

  }]);

}) ();
