(function() {

  var app = angular.module('webbitClient', [ 'graphState', 'graphView', 'graphDirectives', 'optionsPanel' ]);

  app.controller('WebbitController', ['$scope', '$timeout', 'ViewTransform', 'ViewPan', 'viewState', 'graphState',
  function ($scope, $timeout, ViewTransform, ViewPan, viewState, graphState) {

    // the mouse coordinates in local space - updated by this.mousemove
    this.mouse_loc = [0, 0];

    // initialize the view transform object
    var appDiv = $('#appDiv');

    var ctrl = this;

    // make view transform object
    var viewTransform = new ViewTransform( [0, 0],  appDiv.width(), appDiv.height(), appDiv.width(), appDiv.height() );
    // initialize the view panning object (with no data)
    var viewPan = new ViewPan(ctrl.mouse_loc, graphState.nodes, viewTransform);
    // initialize view state for sharing across modules
    viewState.init(viewTransform, viewPan);

    // get data
    graphState.updateNodesInView( function (data) {

      // Expose data to the DOM template for display
      ctrl.graphData = data;

    });

    // graphState.getInRadius([0, 0], viewState.getViewRadius(), function (res) {
    //
    //   ctrl.graphData = res.data.nodes;
    //   ctrl.graphMap = res.data.nodeMap;
    //   $scope.graphData = ctrl.graphData;
    //   $scope.graphMap = ctrl.graphMap;
    //
    //   // get data
    //   viewPan.data = res.data.nodes;
    //
    //   // append local coords to the data
    //   viewTransform.g2l_batch(ctrl.graphData);
    // });
    //
    var appDivPos = appDiv.position();

    // For recording the mouse position
    this.mousemove = function(event) {
      this.mouse_loc[0] = event.pageX - appDivPos.left;
      this.mouse_loc[1] = event.pageY - appDivPos.top;
    }

    // For panning the view
    this.mousedown = function(event) {
      if (event.target.id == 'appDiv') {
        viewState.viewPan.startPan();
      }
    };
    this.mouseup = function(event) {
      viewState.viewPan.stopPan();
    };

    this.full = function($event, node) {

      this.fullNode = node;
    }

  }]);

})();
