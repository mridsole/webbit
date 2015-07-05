// module for the state of the graph
( function () {

  var graphState = angular.module('graphState', [ ]);

  // SERVICE API for communicating with the node server
  graphState.factory('graphStateAPI', ['$http', function ($http) {

    var graphStateAPI = {};

    graphStateAPI.getInRadius = function(loc, radius, callback) {

      var headers = { 'Content-Type': 'application/json' };
      var params = { x: loc[0], y: loc[1], r: radius };
      $http.get('/api/nodes/around', { headers: headers, params: params } )
      .success(callback);
    }

    graphStateAPI.newNode = function(loc, node, callback) {

      var headers = { 'Content-Type': 'application/json' };
      var params = { }
      // $http.post('/api/nodes/new', )
    }

    return graphStateAPI;

  }]);

}) ();
