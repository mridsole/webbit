// clientside

(function() {

  // some sample graph data
  var graphData = [
    { id: 1, text: "node 1", gx: 0, gy: 0, connect: [] },
    { id: 2, text: "node 2", gx: 0, gy: 20, connect: [ 1 ] },
    { id: 3, text: "node 3", gx: 0, gy: 10, connect: [ 1, 2 ] },
    { id: 4, text: "node 4", gx: 0, gy: 30, connect: [ 2 ] },
    { id: 5, text: "node 5", gx: 0, gy: 50, connect: [ 3, 4 ] }
  ];

  var app = angular.module('webbitClient', [  ]);

  app.controller('WebbitController', function () {

    this.graphData = graphData;
  });

})();
