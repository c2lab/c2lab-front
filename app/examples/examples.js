'use strict';

angular.module('myApp.examples', [])

.controller('ExamplesCtrl', [ "$scope", "$location", "authService", "exampleSvc",
  function($scope, $location, authService, exampleSvc) {
    $scope.examples = exampleSvc.all();

    $scope.edit = ({ script }) =>  $location.path("/editor").search({ script });

    $(document).ready(function() {
      $(".sketch-box").dimmer({
        on: "hover"
      })
    });
  }
]);