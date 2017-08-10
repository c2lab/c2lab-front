'use strict';

let gallery = angular.module('myApp.gallery', []);

function GalleryCtrl($scope, authService, sketchSvc, $location) {
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

    $scope.canEdit = ({ owner }) => owner === user.user_id;
  });

  $scope.edit = ({ _id }) =>  $location.path("/editor").search({ sketch_id: _id });
}

gallery.controller('GalleryCtrl', [ "$scope", "authService", "sketchSvc", "$location", GalleryCtrl]);
