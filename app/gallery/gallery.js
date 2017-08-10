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

  let loadSketches = () => {
    authService.currentUser().then((user) => {
      sketchSvc.all({ user  }).then((sketchs) => {
        $scope.sketchs = sketchs;
        showActionsOnHover();
      });

      let isOwner = ({ owner }) => owner === user.user_id;
      $scope.canEdit = isOwner;
      $scope.canRemove = isOwner;
    });
  }

  loadSketches();

  $scope.edit = ({ _id }) =>  $location.path("/editor").search({ sketch_id: _id });
  
  $scope.delete = ({ _id }) =>  {
    $scope.confirmDeleteModal.modal('setting', {
      onApprove: () => {
        sketchSvc.delete(_id).then(({ title }) => {
          console.log(`${title} was correctly deleted.`);
          loadSketches();
        });
      }
    }).modal("show");
  }

  angular.element(document).ready(function () {
    $scope.confirmDeleteModal = $("#confirm-delete-modal");
  });
}

gallery.controller('GalleryCtrl', [ "$scope", "authService", "sketchSvc", "$location", GalleryCtrl]);
