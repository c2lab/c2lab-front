'use strict';

let gallery = angular.module('myApp.gallery', []);

function GalleryCtrl($scope, authService, sketchSvc, $location, $q, likeSvc) {
  function showActionsOnHover() {
    $(document).ready(function() {
      $(".sketch-box").dimmer({
        on: "hover"
      })
    });
  }

  let updateLikeStatus = () => {
    likeSvc.myLikesFor({ sketches: $scope.sketches }).then((likes) => {
      $scope.sketches.forEach((sketch) => {
        let like = likes.find(({ sketch_id }) => sketch_id === sketch._id);
        sketch.isLiked = !!like;
        console.log(`${sketch.title} is liked: ${sketch.isLiked}`);
        likeSvc.sketchTotal({ sketch }).then((total) => {
          sketch.totalLikes = total;
          console.log(`${sketch.title} has ${sketch.totalLikes} likes.`);
        });
      });
    });
  }

  let updateLikeStatusFor = (sketch) => {
    likeSvc.myLikeFor({ sketch }).then((like) => {
        sketch.isLiked = !!like;
        console.log(`${sketch.title} is liked: ${sketch.isLiked}`);
        likeSvc.sketchTotal({ sketch }).then((total) => {
          sketch.totalLikes = total;
          console.log(`${sketch.title} has ${sketch.totalLikes} likes.`);
        });
    });
  }

  let loadSketches = () => {
    authService.currentUser().then((user) => {
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
    if (sketch.isLiked) {
      sketch.isLiked = false;
      sketch.totalLikes = (sketch.totalLikes || 1) - 1;
      likeSvc.dislike({ sketch }).then((response) => {
        updateLikeStatusFor(sketch);
      });
    } else {
      sketch.isLiked = true;
      sketch.totalLikes = (sketch.totalLikes || 0) + 1;
      likeSvc.like({ sketch }).then((response) => {
        updateLikeStatusFor(sketch);
      });
    }
  }

  angular.element(document).ready(function () {
    $scope.confirmDeleteModal = $("#confirm-delete-modal");
  });
}

gallery.controller('GalleryCtrl', [ "$scope", "authService", "sketchSvc", "$location", "$q", "likeSvc", GalleryCtrl]);
