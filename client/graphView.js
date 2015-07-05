( function () {

  // Module containing functionality for graph panning and transforms
  var graphView = angular.module('graphView',  []);

  // Controller for a node - requires that node be in the scope on initialisation
  graphView.controller('NodeController', ['$scope', function ($scope) {

    this.node = $scope.webbitNode;
    this.class = "webbit-node";

    // return a style object detailing the local coords of the node
    this.style_nodeCoords = function () {

      return {
        left: this.node.loc_local[0],
        top: this.node.loc_local[1],
        transform: 'translate(-50%, -50%)'
        };
    };

    // For highlighting nodes - might add more functionality later
    this.mouseover = function(event) {
      this.class = 'webbit-node-hover';
    };

    this.mouseleave = function(event) {
      this.class = 'webbit-node';
    };

  }]);

  graphView.controller('EdgeController', ['$scope', 'ViewTransform', function ($scope, ViewTransform) {

    this.class = "webbit-edge";
    this.nodeOrigin = $scope.webbitNode;
    this.nodeReplyTo = $scope.graphData[$scope.graphMap[$scope.nodeID]];

    this.style_edge = function() {

      style = {
        left: this.nodeOrigin.loc_local[0],
        top: this.nodeOrigin.loc_local[1],
        transform: 'translate(-50%, -50%)'
      };

      style.width = ViewTransform.dist(this.nodeOrigin.loc_local, this.nodeReplyTo.loc_local);
      style.transformOrigin = "0% 0%";
      style.transform = "rotate(" + ViewTransform.ang(this.nodeOrigin.loc_local, this.nodeReplyTo.loc_local) + "rad)";

      return style;
    };

  }]);

  // Controller for an edge

  // SERVICE for view transformations between local and global coordinates
  // returns a constructor for ViewTransform
  graphView.factory('ViewTransform', function () {

    var ViewTransform = function ViewTransform (loc, width, height, projWidth, projHeight) {

      this.loc = loc,

      // dimensions of the view port in global space
      this.width = width,
      this.height = height,

      // The dimensions of the projection space, in pixels
      this.projWidth = projWidth,
      this.projHeight = projHeight
    };

    // global to local coords
    ViewTransform.prototype.g2l = function(loc) {
      return [
        (loc[0] - this.loc[0]) * this.projWidth / this.width,
        (loc[1] - this.loc[1]) * this.projHeight / this.height
      ];
    };

    ViewTransform.prototype.g2l_batch = function(nodes) {
      for(i = 0; i < nodes.length; i++) {
        nodes[i].loc_local = this.g2l(nodes[i].loc);
      }
    };

    // local to global coords
    ViewTransform.prototype.l2g = function(loc_local) {
      return [
        (loc_local[0] + this.loc[0]) * this.width / this.projWidth,
        (loc_local[1] + this.loc[1]) * this.height / this.projHeight
      ];
    };

    ViewTransform.prototype.l2g_batch = function(nodes) {
      for(i = 0; i < nodes.length; i++) {
        nodes[i].loc = this.l2g(nodes[i].loc_local);
      }
    };

    // distance between 2 points
    ViewTransform.dist = function(l1, l2) {
      return Math.sqrt( Math.pow(l1[0] - l2[0], 2) + Math.pow(l1[1] - l2[1], 2) );
    }

    // angle between 2 points
    ViewTransform.ang = function(l1, l2) {
      return Math.atan2(l1[1] - l2[1], l1[0] - l2[0]) + Math.PI;
    }

    return ViewTransform;

  });

  // SERVICE for panning - depends on viewTransform
  // returns a constructor for ViewPan
  graphView.factory('ViewPan', ['$interval', function ($interval) {

    // this.data should have loc and loc_local property
    var ViewPan = function (mouse_loc, data, view) {

      // location of mouse in local coords
      this.mouse_loc = mouse_loc;
      // the graph data to pan
      this.data = data;
      // ViewTransform object to call for global-local transformations
      this.view = view;

      // interval in ms between panning calls
      this.interval = 25;
      // previous location of mouse in local coords
      this.mouse_loc_last = [0, 0];
      // indicates wether or not it's currently panning
      this.panning = false;
      // promise returned by $interval service
      this.panningPromise = null;

    };

    ViewPan.prototype.startPan = function () {

      if (this.panning) { return; }

      // make a copy of mouse_loc to store the previous mouse position
      this.mouse_loc_last = this.mouse_loc.slice();

      this.panningPromise = $interval(pan, this.interval, 0, true, this);
      this.panning = true;
    };

    ViewPan.prototype.stopPan = function () {

      this.panning = false;

      if (this.panningPromise != null) {
        $interval.cancel(this.panningPromise);
      }

      this.panningPromise = null;
    };

    var pan = function (viewPan) {

      viewPan.view.loc[0] -= viewPan.mouse_loc[0] - viewPan.mouse_loc_last[0];
      viewPan.view.loc[1] -= viewPan.mouse_loc[1] - viewPan.mouse_loc_last[1];

      viewPan.mouse_loc_last[0] = viewPan.mouse_loc[0];
      viewPan.mouse_loc_last[1] = viewPan.mouse_loc[1];

      viewPan.view.g2l_batch(viewPan.data);
    }

    return ViewPan;

  }]);

}) ();
