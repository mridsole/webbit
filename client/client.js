(function() {

  var app = angular.module('webbitClient', [ 'graphState', 'graphView', 'graphDirectives', 'optionsPanel' ]);

  app.controller('WebbitController', ['$scope', '$timeout', 'ViewTransform', 'ViewPan', 'viewState', 'graphState',
  function ($scope, $timeout, ViewTransform, ViewPan, viewState, graphState) {

    // for reference in callbacks
    var ctrl = this;

    // the mouse coordinates in local space - updated by this.mousemove
    this.mouse_loc = [0, 0];

    // whether or not we're adding a node
    this.uiState = viewState.uiState;

    // initialize the view transform object
    var appDiv = $('#appDiv');

    // make view transform object
    var viewTransform = new ViewTransform( [0, 0],  appDiv.width(), appDiv.height(), appDiv.width(), appDiv.height() );
    // initialize the view panning object (with no data)
    var viewPan = new ViewPan(ctrl.mouse_loc, graphState.nodes, viewTransform);
    // initialize view state for sharing across modules
    viewState.init(viewTransform, viewPan);
    // initialize the graph state - once we get data, add some local coords to it
    graphState.init(viewState.getLoc(), viewState.getViewRadius() + 20000, viewState.viewTransform, function (data, watch) {
      console.log('data: ');
      console.log(data);
      console.log('watch: ');
      console.log(watch);
    });

    // expose graph data to the template
    this.graphData = graphState.nodes;

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
