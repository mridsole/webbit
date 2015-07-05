(function() {

  var app = angular.module('webbitClient', [ 'graphState', 'graphView', 'graphDirectives', 'optionsPanel' ]);

  app.controller('WebbitController', ['$scope', '$timeout', 'ViewTransform', 'ViewPan', 'graphStateAPI',
  function ($scope, $timeout, ViewTransform, ViewPan, graphStateAPI) {

    // the mouse coordinates in local space - updated by this.mousemove
    this.mouse_loc = [0, 0];

    // initialize the view transform object
    var appDiv = $('#appDiv');
    var view = new ViewTransform( [0, 0],  appDiv.width(), appDiv.height(), appDiv.width(), appDiv.height() );
    var viewPan;

    var ctrl = this;

    // get data
    var radius = Math.sqrt( Math.pow(view.width, 2) + Math.pow(view.height, 2) ) + 100;
    graphStateAPI.getInRadius(view.loc, radius, function (res) {

      ctrl.graphData = res.data.nodes;
      ctrl.graphMap = res.data.nodeMap;
      $scope.graphData = ctrl.graphData;
      $scope.graphMap = ctrl.graphMap;

      // append local coords to the data
      view.g2l_batch(ctrl.graphData);

      // initialize the view pan object
      viewPan = new ViewPan(ctrl.mouse_loc, ctrl.graphData, view);
    });

    $scope.view = view;

    var appDivPos = appDiv.position();

    // For recording the mouse position
    this.mousemove = function(event) {
      this.mouse_loc[0] = event.pageX - appDivPos.left;
      this.mouse_loc[1] = event.pageY - appDivPos.top;
    }

    // For panning the view
    this.mousedown = function(event) {
      if (event.target.id == 'appDiv') {
        viewPan.startPan();
      }
    };
    this.mouseup = function(event) {
      viewPan.stopPan();
    };

    this.full = function($event, node) {

      this.fullNode = node;
    }

  }]);

})();
