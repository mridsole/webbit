// clientside

(function() {

  // some sample graph data
  var graphData = [
    { id: 1, author_id: 1, text: "node 1", gx: 50, gy: 0, class: 'webbit-node', connect: [] },
    { id: 2, author_id: 2, text: "node 2", gx: 350, gy: 20, class: 'webbit-node', connect: [ 1 ] },
    { id: 3, author_id: 1, text: "lots and lots and lots and lots and lots and lots and lots and lots and lots and lots and lots and lots and lots and lots", gx: 500, gy: 10, class: 'webbit-node', connect: [ 1, 2 ] },
    { id: 4, author_id: 3, text: "node 4", gx: 150, gy: 230, class: 'webbit-node', connect: [ 2 ] },
    { id: 5, author_id: 2, text: "node 5", gx: 450, gy: 450, class: 'webbit-node', connect: [ 3, 4 ] }
  ];

  // map id to index
  var graphMap = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };

  var app = angular.module('webbitClient', [  ]);

  app.controller('WebbitController', function () {

    this.graphData = graphData;

    this.nodeDist = function(node1, node2) {
      return Math.sqrt(Math.pow(node1.gx - node2.gx, 2) + Math.pow(node1.gy - node2.gy, 2));
    };

    this.nodeAng = function(node1, node2) {
      return Math.atan2(node1.gy - node2.gy, node1.gx - node2.gx);
    };

    // return a style object detailing the global coords of the node
    this.style_nodeCoords = function(node) {
      return { left: node.gx, top: node.gy };
    };

    // return a style object detailing length and angle of an edge
    this.style_edge = function(node1_id, node2_id) {

      var node1 = graphData[graphMap[node1_id]];
      var node2 = graphData[graphMap[node2_id]];

      console.log( this.nodeDist(node1, node2) );

      style = this.style_nodeCoords(node1);
      style.width = this.nodeDist(node1, node2);
      style.transformOrigin = "0% 0%";
      style.transform = "rotate(" + (this.nodeAng(node1, node2)) + "rad)";

      return style;
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

  // element directive for an edge
  app.directive('webbitEdge', function() {
    return {
      restrict: 'E',
      templateUrl: 'directives/webbit-edge.html'
    };
  });

})();
