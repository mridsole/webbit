( function () {

  // Module containing functionality for graph nodes/edges display, and panning and transforms
  var graphView = angular.module('graphView',  ['graphState']);

  // Controller for a node - requires that node be in the scope on initialisation
  graphView.controller('NodeController', ['$scope', 'viewState',
  function ($scope, viewState) {

    // for accessing the node data
    this.node = $scope.webbitNode;

    // store the class when in browsing mode
    this.class = 'webbit-node';

    // store the class when in adding mode
    this.addingClass = 'webbit-node-disabled';

    // whether or not this node has been selected as a reply in nodeAdd mode
    this.selected = false;

    // for binding to the DOM with ng-class
    this.classBinding = function () {

      if (viewState.uiState.addingNode) {
        if (this.selected) {
          this.addingClass = 'webbit-node';
        } else {
          this.addingClass = 'webbit-node-disabled';
        }
        return this.addingClass;
      }

      this.selected = false;
      return this.class;
    };

    // return a style object detailing the local coords of the node
    this.style_nodeCoords = function () {

      return {
        left: this.node.loc_local[0],
        top: this.node.loc_local[1],
        transform: 'translate(-50%, -50%)'
        };
    };

    // For highlighting nodes - might add more functionality later
    this.mouseover = function (event) {
      if (!viewState.uiState.addingNode) {
        this.class = 'webbit-node-hover';
      }
    };

    this.mouseleave = function (event) {
      if (!viewState.uiState.addingNode) {
        this.class = 'webbit-node';
      }
    };

    this.click = function (event) {

      // if adding a node, set it as class 'webbit-node'
      if (viewState.uiState.addingNode) {
        this.selected = viewState.uiState.select(this.node);
      }
    };

  }]);

  // Controller for an edge
  graphView.controller('EdgeController', ['$scope', 'ViewTransform', 'viewState', 'graphState',
  function ($scope, ViewTransform, viewState, graphState) {

    this.class = 'webbit-edge';
    this.nodeOrigin = $scope.webbitNode;
    this.nodeReplyTo = graphState.getNodeByID($scope.nodeID);

    this.classBinding = function () {

      if (viewState.uiState.addingNode) {
        this.class = 'webbit-edge-disabled';
      } else {
        this.class = 'webbit-edge';
      }
      return this.class;
    };

    this.style_edge = function() {

      style = {
        left: this.nodeOrigin.loc_local[0],
        top: this.nodeOrigin.loc_local[1],
        transform: 'translate(-50%, -50%);'
      };

      style.width = ViewTransform.dist(this.nodeOrigin.loc_local, this.nodeReplyTo.loc_local);
      style.transformOrigin = "0% 0%";
      style.transform = "rotate(" + ViewTransform.ang(this.nodeOrigin.loc_local, this.nodeReplyTo.loc_local) + "rad)";

      return style;
    };

  }]);

  // Controller for a node in adding mode
  graphView.controller('NodeAddingController', ['$scope', 'viewState', 'graphState',
  function ($scope, viewState, graphState) {

    this.uiState = viewState.uiState;
    this.node = viewState.uiState.node;
    this.connect = viewState.uiState.selected;

    // bind the connected nodes to the scope so webbit-adding-edge can access
    $scope.connect = this.connect;

    this.class = 'webbit-node-adding-ok';
    this.inputClass = 'webbit-node-adding-input';

    this.classBinding = function () {

      var nodeDistValid = viewState.uiState.nodeDistIsValid();

      if (nodeDistValid) {
        this.class = 'webbit-node-adding-ok';
      } else { this.class = 'webbit-node-adding-err'; };

      return this.class;
    };

    this.style_nodeCoords = function () {

      var loc_local = viewState.viewTransform.g2l(this.node.loc);

      return {
        left: loc_local[0],
        top: loc_local[1],
        transform: 'translate(-50%, -50%)'
        };
    };

    this.click = function () {

      // before placement, check validity
      var valid = viewState.uiState.nodeIsValid();

      if (!valid) { return; }

      // disable mouse following
      viewState.uiState.placeAddNode();
      // accept text input
    };

  }]);

  graphView.controller('EdgeAddingController', ['$scope', 'ViewTransform', 'viewState', 'graphState',
  function ($scope, ViewTransform, viewState, graphState) {

    this.class = 'webbit-edge-adding-ok';
    this.nodeOrigin = viewState.uiState.node;
    this.nodeReplyTo = graphState.getNodeByID($scope.node._id);

    this.classBinding = function () {

      // range validity checks
      if (viewState.uiState.edgeIsValid(this.nodeOrigin, this.nodeReplyTo)) {
        this.class = 'webbit-edge-adding-ok';
      } else {
        this.class = 'webbit-edge-adding-err';
      }
      return this.class;
    };

    this.style_edgeCoords = function() {

      var nodeLocLocal = viewState.viewTransform.g2l(viewState.uiState.node.loc);

      style = {
        left: nodeLocLocal[0],
        top: nodeLocLocal[1],
        transform: 'translate(-50%, -50%);'
      };

      style.width = ViewTransform.dist(nodeLocLocal, this.nodeReplyTo.loc_local);
      style.transformOrigin = "0% 0%";
      style.transform = "rotate(" + ViewTransform.ang(nodeLocLocal, this.nodeReplyTo.loc_local) + "rad)";

      return style;
    };

  }]);

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
      this.interval = 40;
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

  // SERVICE for getting the state of the view, including the current ViewTransform and ViewPan object
  // this doesn't return a constructor but rather a nice way of sharing the view state across modules
  // also contains the 'state' of the user interface i.e. whether or not a new node is being added
  graphView.factory('viewState', ['$interval', 'ViewTransform', 'graphState',
  function ($interval, ViewTransform, graphState) {

    // maximum number of connections allowed
    var MAX_REPLIES = 4;
    // min and max distance for edges
    var NODE_MIN_DIST = 150;
    var EDGE_MIN_DIST = 150;
    var EDGE_MAX_DIST = 600;

    var updateNodeLoc = function (viewState) {
      var mouseLoc = viewState.getMouseLoc();
      viewState.uiState.node.loc[0] = mouseLoc[0];
      viewState.uiState.node.loc[1] = mouseLoc[1];
    };

    var viewState = {};

    viewState.uiState = {

      addingNode: false,

      acceptText: false,

      // promise for the updateMouseLoc interval
      intervalPromise: null,

      // list of nodes that are selected
      selected: [],

      // the data for the node that is being added, ie loc, connect, etc
      node: { text: '', loc: [0, 0], connect: [] },

      textEntered: '',

      // enter add node mode
      startAddNode: function () {

        this.addingNode = true;
        this.sendingRequest = false;
        this.acceptText = false;
        this.textEntered = '';

        // clear list of selected nodes in place
        this.selected.length = 0;

        // bind node.connect to this.selected (we'll make a copy once we add)
        this.node.connect = this.selected;

        // start updating mouse location
        this.intervalPromise = $interval(updateNodeLoc, 30, 0, true, viewState);
      },

      // leave add node mode
      cancelAddNode: function () {

        this.addingNode = false;
        this.acceptText = false;
        this.textEntered = '';

        // stop the interval
        $interval.cancel(this.intervalPromise);
      },

      placeAddNode: function () {

        // check for validity
        var valid = this.nodeIsValid();

        if (!valid) { return false };

        // stop moving the node
        $interval.cancel(this.intervalPromise);

        // allow text input for the node
        this.acceptText = true;
      },

      finishAddNode: function () {

        this.node.text = this.textEntered;
        this.sendingRequest = true;

        // replace connect array with ID array
        var ids = [];
        for (var i = 0; i < this.node.connect.length; i++) {
          ids.push(this.node.connect[i]._id);
        }
        this.node.connect = ids;

        graphState.addNode(this.node, function (node) {
          viewState.uiState.addingNode = false;
          viewState.uiState.acceptText = false;
          viewState.viewTransform.g2l_batch([node]);
        });
      },

      updateAddNodePos: function () {
        var mouseLoc = viewState.getMouseLoc();
        this.node.loc[0] = mouseLoc[0];
        this.node.loc[1] = mouseLoc[1];
      },

      // in add node mode, add a new node
      select: function (node) {

        // check if it's already in the array
        var index = _.findIndex(this.selected, { _id: node._id });
        var added = false;

        if (index == -1 && this.selected.length < MAX_REPLIES) {
          this.selected.push(node);
          added = true;
        } else if (index != -1) {
          this.selected.splice(index, 1);
        }

        return added;
      },

      // check whether or not the edges satisfy min/max distances
      // and that the node has at least one connection
      // we also have to check the node satisfies min distances with ALL OTHER NODES
      nodeIsValid: function () {

        if (this.node.connect.length == 0) { return false; }

        for (var i = 0; i < this.node.connect.length; i++) {
          if (!this.edgeIsValid(this.node, this.node.connect[i])) {
            return false;
          }
        }

        var nodeDistValid = this.nodeDistIsValid();

        return nodeDistValid;
      },

      nodeDistIsValid: function () {

        for (var i = 0; i < graphState.nodes.length; i++) {
          var dist = ViewTransform.dist(this.node.loc, graphState.nodes[i].loc);
          if (dist < NODE_MIN_DIST) { return false; }
        }

        return true;
      },

      // check that an edge between two given nodes is valid
      edgeIsValid: function (node1, node2) {
        var dist = ViewTransform.dist(node1.loc, node2.loc);
        if (dist > EDGE_MIN_DIST && dist < EDGE_MAX_DIST) {
          return true;
        } else { return false; }
      }

    };

    viewState.init = function (viewTransform, viewPan) {
      this.viewTransform = viewTransform;
      this.viewPan = viewPan;
    };

    // get the mouse location in GLOBAL coords
    viewState.getMouseLoc = function () {
      return this.viewTransform.l2g(this.viewPan.mouse_loc);
    };

    // get the global position of the MIDDLE of the screen
    viewState.getLoc = function () {
      return [
        this.viewTransform.loc[0] + (this.viewTransform.width / 2),
        this.viewTransform.loc[1] + (this.viewTransform.height / 2)
      ];
    };

    // set the global position of the middle of the screen
    viewState.setLoc = function (loc) {
      this.viewTransform.loc[0] = loc[0] - (this.viewTransform.width / 2);
      this.viewTransform.loc[1] = loc[1] - (this.viewTransform.height / 2);
    };

    // buffered view radius (ie radius that all partially visible nodes are in)
    viewState.getViewRadius = function () {
      return Math.sqrt( Math.pow(0.5*this.viewTransform.width, 2) + Math.pow(0.5*this.viewTransform.height, 2) ) + 100;
    };

    return viewState;

  }]);
}) ();
