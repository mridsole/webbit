// clientside

(function() {

  // some sample graph data
  var graphData = [
    { id: 1, author_id: 1, text: "node 1", gx: 750, gy: 400, class: 'webbit-node', connect: [] },
    { id: 2, author_id: 2, text: "node 2", gx: 350, gy: 20, class: 'webbit-node', connect: [ 1 ] },
    { id: 3, author_id: 1, text: "lots and lots and lots and lots and lots and lots and lots and lots and lots and lots and lots and lots and lots and lots", gx: 500, gy: 10, class: 'webbit-node', connect: [ 1, 2 ] },
    { id: 4, author_id: 3, text: "node 4", gx: 150, gy: 230, class: 'webbit-node', connect: [ 2 ] },
    { id: 5, author_id: 2, text: "node 5", gx: 450, gy: 450, class: 'webbit-node', connect: [ 3, 4 ] },
    { id: 6, author_id: 2, text: "DAVE SUCKS", gx: 300, gy: 350, class: 'webbit-node', connect: [ 3, 4, 5 ] }
  ];

  // map id to index
  var graphMap = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8 };

  var app = angular.module('webbitClient', [  ]);

  app.controller('WebbitController', function () {

    this.graphData = graphData;

    // initialize the View object
    var appDiv = $('#appDiv');
    View.init( 0, 0,  appDiv.width(), appDiv.height(), appDiv.width(), appDiv.height() );
    View.g2l_batch(graphData);

    this.nodeDist = function(node1, node2) {
      return Math.sqrt(Math.pow(node1.lx - node2.lx, 2) + Math.pow(node1.ly - node2.ly, 2));
    };

    this.nodeAng = function(node1, node2) {
      return Math.atan2(node1.ly - node2.ly, node1.lx - node2.lx) + Math.PI;
    };

    // return a style object detailing the local coords of the node
    this.style_nodeCoords = function(node) {
      return { left: node.lx, top: node.ly, transform: 'translate(-50%, -50%)' };
    };

    // return a style object detailing length and angle of an edge
    this.style_edge = function(node1_id, node2_id) {

      var node1 = graphData[graphMap[node1_id]];
      var node2 = graphData[graphMap[node2_id]];

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

    this.mousemove = function(event) {
      View.gx = event.pageX - 800;
      View.gy = event.pageY - 300;
      View.g2l_batch(graphData);
    }

    this.full = function(node) {

      this.fullNode = node;

    }

  });

  // DIRECTIVES

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

  // element directive for node panel
  app.directive('webbitNodeFull', function() {
    return {
      restrict: 'E',
      templateUrl: 'directives/webbit-node-full.html'
    };
  });

})();
