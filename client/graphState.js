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
      nodeMap: {}
    };

    // get CURRENTLY LOADED node by ID
    graphState.getNodeByID = function (id) {
      return this.nodes[this.nodeMap[id]];
    };

    graphState.updateNodes = function (loc, radius, viewTransform, callback) {

      graphStateAPI.getInRadius(loc, radius, function (res, asdf) {
        // update the node map
        var nNodesBefore = graphState.nodes.length;
        for (var i = 0; i < res.data.nodes.length; i++) {
          graphState.nodeMap[res.data.nodes[i]._id] = i + nNodesBefore;
          graphState.nodes.push(res.data.nodes[i]);
        };

        // add local coordinate information to the new data
        viewTransform.g2l_batch(graphState.nodes);

        console.log( 'fetched nodes' );
        if (callback != undefined && callback != null) {
          callback(res.data.nodes);
        }
      });
    };

    // add a node
    graphState.addNode = function (node, callback) {

      graphStateAPI.newNode(node, function (res) {
        // update the nodes array and nodeMap
        graphState.nodes.push(res.data.node);
        graphState.nodeMap[res.data.node._id] = graphState.nodes.length - 1;
        callback(graphState.getNodeByID(res.data.node._id));
      });
    };

    return graphState;

  }]);

  // SERVICE API for communicating with the node server
  graphState.factory('graphStateAPI', ['$http', function ($http) {

    var graphStateAPI = {};

    graphStateAPI.getInRadius = function(loc, radius, callback) {

      var headers = { 'Content-Type': 'application/json' };
      var params = { x: loc[0], y: loc[1], r: radius };
      $http.get('/api/nodes/around', { headers: headers, params: params } )
      .success(callback);
    }

    graphStateAPI.newNode = function( node, callback) {

      var headers = { 'Content-Type': 'application/json' };
      var params = { }
      $http.post('/api/nodes/new', node ).success(callback);
    }

    return graphStateAPI;

  }]);

}) ();
