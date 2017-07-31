'use strict';

angular.module('myApp.gallery', [])

.controller('GalleryCtrl', [ "$scope", "authService", "sketchSvc", function($scope, authService, sketchSvc) {
  $scope.sketchs = sketchSvc.all({ user: authService.user });

  $(document).ready(function() {
    $(".ui.dimmer").dimmer({
      on: "hover"
    })
  });
}]);