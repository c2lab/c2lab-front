'use strict';

angular.module('myApp.navbar', []).directive("navbarButton", function() {
  return {
    transclude: true,
    scope: {
      navbarButton: '@'
    },
    controller: [ "$scope", "$location", function($scope, $location) {
          $scope.isActive = () => $scope.path === $location.path();
        }],
    templateUrl: "directives/navbar-button.html",
    link: function(scope) {
      scope.path = `/${scope.navbarButton}`;
    }
  };
});