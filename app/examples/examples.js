'use strict';

angular.module('myApp.examples', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/examples', {
    templateUrl: 'examples/examples.html',
    controller: 'ExamplesCtrl'
  });
}])

.controller('ExamplesCtrl', [ "$scope", "authService", "exampleSvc", function($scope, authService, exampleSvc) {
  $scope.examples = exampleSvc.all();

  $(document).ready(function() {
    $(".ui.dimmer").dimmer({
      on: "hover"
    })
  });
}]);