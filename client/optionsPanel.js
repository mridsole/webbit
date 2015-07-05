( function() {

  var app = angular.module('optionsPanel', [ 'graphState' ]);

  app.directive('optionsPanel', function () {
    return {
      restrict: 'E',
      templateUrl: 'directives/webbit-options.html'
    }
  });

  app.controller('OptionsPanelController', ['graphStateAPI', function(graphStateAPI) {
    this.class = 'options-panel';
  }]);


}) ();
