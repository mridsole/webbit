( function() {

  var app = angular.module('optionsPanel', [ 'graphView' ]);

  app.directive('optionsPanel', function () {
    return {
      restrict: 'E',
      templateUrl: 'directives/webbit-options.html'
    }
  });

  app.directive('webbitAddingTextPanel', function () {
    return {
      restrict: 'E',
      templateUrl: 'directives/webbit-adding-text-panel.html'
    };
  });

  app.directive('webbitButton', function () {
    return {
      restrict: 'E',
      templateUrl: 'directives/webbit-options'
    }
  });

  app.controller('OptionsPanelController', function() {

    this.class = 'options-panel';
  });

  app.controller('AddNodeButtonController', ['$document', 'viewState',
  function ($document, viewState) {

    var ESC_KEY_CODE = 27;

    this.class = 'options-button';

    this.mouseover = function (event) {
      this.class = 'options-button-hover';
    };

    this.mouseleave = function (event) {
      this.class = 'options-button';
    };

    this.click = function (event) {

      if (viewState.uiState.addingNode == false) {
        viewState.uiState.startAddNode();
      }
    };

    $document.on( 'keydown', function (event) {

      if (event.keyCode == ESC_KEY_CODE) {
        viewState.uiState.cancelAddNode();
      }
    });
  }]);

  // Controller for the text panel that pops up when setting node text
  app.controller('AddingTextPanelController', ['$scope', 'viewState',
  function ($scope, viewState) {

    this.class = 'text-add-panel';
    this.uiState = viewState.uiState;

    this.confirmBtnText = function () {
      if (viewState.uiState.sendingRequest) {
        return 'Adding node ...';
      } else {
        return 'Confirm';
      }
    };

    this.confirm = function () {

      viewState.uiState.finishAddNode();
    };
  }]);

}) ();
