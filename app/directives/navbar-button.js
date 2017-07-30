'use strict';

angular.module('myApp.navbar', []).directive("navbarButton", function() {
  return {
    transclude: true,
    scope: {
      path: '@'
    },
    controller: [ "$scope", "$location", function($scope, $location) {
          $scope.isActive = () => $scope.path === $location.path();
        }],
    templateUrl: "directives/navbar-button.html"
  };
});