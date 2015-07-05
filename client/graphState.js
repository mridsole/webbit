// module for the state of the graph
( function () {

  var graphState = angular.module('graphState', [ ]);

  // SERVICE for dealing with the curren state of the graph
  // used for accessing nodes by ID, requesting updates, etc
  graphState.factory('graphState', ['viewState', 'graphStateAPI', function (viewState, graphStateAPI) {

    var graphState = {
      nodes: [],
      nodeMap: {}
    };

    graphState.getNodeByID = function (id) {
      return this.nodes[this.nodeMap[id]];
    };

    // get all the nodes in view and add it to the graphState
    graphState.updateNodesInView = function (callback) {

      console.log( 'getting nodes in screen radius ' + String(viewState.getViewRadius()) );

      graphStateAPI.getInRadius(viewState.getLoc(), viewState.getViewRadius(), function (res) {

        // update the node map
        var nNodesBefore = graphState.nodes.length;
        for (var i = 0; i < res.data.nodes.length; i++) {
          graphState.nodeMap[res.data.nodes[i]._id] = i + nNodesBefore;
          graphState.nodes.push(res.data.nodes[i]);
        };

        // add local coordinate information to the new data
        viewState.viewTransform.g2l_batch(graphState.nodes);

        console.log( 'fetched nodes' );
        if (callback != undefined && callback != null) {
          callback(res.data.nodes);
        }
      });
    };

    graphState.add = function () {

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
