'use strict';

angular.module('myApp.gallery', [])

.controller('GalleryCtrl', [ "$scope", "authService", "sketchSvc", function($scope, authService, sketchSvc) {
  function showActionsOnHover() {
    $(document).ready(function() {
      $(".ui.dimmer").dimmer({
        on: "hover"
      })
    });
  }

  authService.currentUser().then((user) => {
    sketchSvc.all({ user  }).then((sketchs) => {
      $scope.sketchs = sketchs;
      showActionsOnHover();
    });
  });

}]);