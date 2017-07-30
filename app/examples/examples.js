'use strict';

angular.module('myApp.examples', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/examples', {
    templateUrl: 'examples/examples.html',
    controller: 'ExamplesCtrl'
  });
}])

.controller('ExamplesCtrl', [ "$scope", "$location", "authService", "exampleSvc",
  function($scope, $location, authService, exampleSvc) {
    $scope.examples = exampleSvc.all();

    $scope.edit = ({ script }) =>  $location.path("/editor").search({ script });

    $(document).ready(function() {
      $(".ui.dimmer").dimmer({
        on: "hover"
      })
    });
  }
]);