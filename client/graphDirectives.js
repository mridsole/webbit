(function () {

  var app = angular.module('graphDirectives', []);

  // element directive for a node
  app.directive('webbitNode', function () {
    return {
      restrict: 'E',
      templateUrl: 'directives/webbit-node.html'
    };
  });

  // element directive for an edge
  app.directive('webbitEdge', function () {
    return {
      restrict: 'E',
      templateUrl: 'directives/webbit-edge.html'
    };
  });

  // element directive for adding node
  app.directive('webbitAddingNode', function () {
    return {
      restrict: 'E',
      templateUrl: 'directives/webbit-adding-node.html'
    };
  });

  app.directive('webbitAddingEdge', function () {
    return {
      restrict: 'E',
      templateUrl: 'directives/webbit-adding-edge.html'
    }
  })

  // element directive for node panel
  app.directive('webbitNodeFull', function () {
    return {
      restrict: 'E',
      templateUrl: 'directives/webbit-node-full.html'
    };
  });

})();
