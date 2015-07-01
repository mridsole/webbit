// clientside

(function() {

  // some sample graph data
  var graphData = [
    { id: 1, text: "node 1", gx: 0, gy: 0, class: 'webbit-node', connect: [] },
    { id: 2, text: "node 2", gx: 250, gy: 20, class: 'webbit-node', connect: [ 1 ] },
    { id: 3, text: "node 3", gx: 100, gy: 10, class: 'webbit-node', connect: [ 1, 2 ] },
    { id: 4, text: "node 4", gx: 0, gy: 230, class: 'webbit-node', connect: [ 2 ] },
    { id: 5, text: "node 5", gx: 0, gy: 450, class: 'webbit-node', connect: [ 3, 4 ] }
  ];

  var app = angular.module('webbitClient', [  ]);

  app.controller('WebbitController', function () {

    this.graphData = graphData;

    // return a style object detailing the global coords of the node
    this.style_nodeCoords = function(node) {
      return { left: node.gx, top: node.gy };
    };

    this.mouseover = function(event, node) {
      node.class = 'webbit-node-hover';
    };

    this.mouseleave = function(event, node) {
      node.class = 'webbit-node';
    };
  });

  // element directive for a node
  app.directive('webbitNode', function() {
    return {
      restrict: 'E',
      templateUrl: 'directives/webbit-node.html'
    };
  });



})();
