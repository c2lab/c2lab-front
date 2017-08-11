'use strict';

angular.module('myApp.sketches', []).directive("sketchBox", function() {
  return {
    transclude: true,
    scope: {
      sketch: '='
    },
    controller: [ "$scope", function($scope) {
      $scope.showActionsOnHover = () => {
        $(".sketch-box").dimmer({
          on: "hover"
        })
      }
    }],
    templateUrl: "directives/sketch-box/index.html"
  };
});