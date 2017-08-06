'use strict';

angular.module('myApp.gallery', [])

.controller('GalleryCtrl', [ "$scope", "authService", "sketchSvc", function($scope, authService, sketchSvc) {
  sketchSvc.all({ user: authService.user }).then((sketchs) => {
    $scope.sketchs = sketchs;
  });

  $(document).ready(function() {
    $(".ui.dimmer").dimmer({
      on: "hover"
    })
  });
}]);