'use strict';

let gallery = angular.module('myApp.gallery', []);

function GalleryCtrl($scope, authService, sketchSvc, $location, $q, likeSvc) {
  let currentUser;
  let getCurrentUser = () => {
    let deferred = $q.defer();

    if (currentUser) {
      deferred.resolve(currentUser);
    } else {
      authService.currentUser().then((user) => {
        currentUser = user;
        deferred.resolve(user);
      });
    }

    return deferred.promise;
  }


  function showActionsOnHover() {
    $(document).ready(function() {
      $(".sketch-box").dimmer({
        on: "hover"
      })
    });
  }

  let updateLikeStatus = () => {
    getCurrentUser().then((user) => {
      $scope.sketches.forEach((sketch) => {
        likeSvc.find({ sketch, user }).then((like) => {
          sketch.isLiked = !!like;
          console.log(`${sketch.title} is liked: ${sketch.isLiked}`);
        });
      });
    });
  }

  let loadSketches = () => {
    getCurrentUser().then((user) => {
      sketchSvc.all({ user  }).then((sketches) => {
        $scope.sketches = sketches;
        updateLikeStatus();
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

  $scope.switchLike = (sketch) => {
    getCurrentUser().then((user) => {
      if (sketch.isLiked) {
        likeSvc.dislike({ user, sketch }).then((response) => {
          updateLikeStatus();
        });
      } else {
        likeSvc.like({ user, sketch }).then((response) => {
          updateLikeStatus();
        });
      }
    });
  }

  angular.element(document).ready(function () {
    $scope.confirmDeleteModal = $("#confirm-delete-modal");
  });
}

gallery.controller('GalleryCtrl', [ "$scope", "authService", "sketchSvc", "$location", "$q", "likeSvc", GalleryCtrl]);
