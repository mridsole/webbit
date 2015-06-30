// clientside

(function() {

  // some sample graph data
  var graphData = [
    { id: 1, text: "DAVE SUCKS", gx: 0, gy: 0, connect: [] },
    { id: 2, text: "yer true", gx: 0, gy: 20, connect: [ 1 ] },
    { id: 3, text: "na", gx: 0, gy: 10, connect: [ 1, 2 ] },
    { id: 4, text: "na ur shit", gx: 0, gy: 30, connect: [ 2 ] },
    { id: 5, text: "yer", gx: 0, gy: 50, connect: [ 3, 4 ] }
  ];

  var app = angular.module('webbitClient', [  ]);

  app.controller('WebbitController', function () {

    this.graphData = graphData;

    // assign z-index equal to id for each node (used for stacking)
    this.setZIndices = function() {

    };
  });

})();
