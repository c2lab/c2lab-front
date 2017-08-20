'use strict';

let gallery = angular.module('myApp.gallery', []);

function GalleryCtrl($scope, authService, sketchSvc, $location, $q, likeSvc, $timeout) {
  function showActionsOnHover() {
    $(document).ready(function() {
      $(".sketch-box").dimmer({
        on: "hover"
      });
    });
  }

  let updateLikeStatus = () => {
    return likeSvc.myLikesFor({ sketches: $scope.sketches }).then((likes) => {
      $scope.sketches.forEach((sketch) => {
        let like = likes.find(({ sketch_id }) => sketch_id === sketch._id);
        likeSvc.sketchTotal({ sketch }).then((total) => {
          sketch.isLiked = !!like;
          sketch.totalLikes = total;
        });
      });
    });
  }

  let updateLikeStatusFor = (sketch) => {
    return likeSvc.myLikeFor({ sketch }).then((like) => {
        likeSvc.sketchTotal({ sketch }).then((total) => {
          sketch.isLiked = !!like;
          sketch.totalLikes = total;
        });
    });
  }

  let loadSketches = (date, search) => {
    authService.currentUser().then((user) => {
      sketchSvc.all({ user , date, search }).then((sketches) => {
        $scope.sketches = sketches;
        updateLikeStatus().then((sketch) => {
          showActionsOnHover();
        });
      });

      let isOwner = ({ owner }) => owner === user.user_id;
      $scope.canEdit = isOwner;
      $scope.canRemove = isOwner;
    });
  }

  let dateSearch;

  const init = () => {
	  $(document).ready(() => {
		  $('#date.ui.dropdown').dropdown({
			  onChange: (value, text, $selectedItem) => {
				  const actions = {
					  "hoy": () => moment().startOf('day').toDate().getTime(),
					  "esta semana": () =>  moment().startOf('isoweek').toDate().getTime(),
					  "este mes": () => moment().startOf('month').toDate().getTime(),
					  "este anio": () => moment().startOf('year').toDate().getTime(),
					  "desde el comienzo": () => null
				  };
				  dateSearch = actions[value]();
				  loadSketches(dateSearch, $scope.textSearch);
			  }
		  });
		  //TODO: Cuadro de busqueda !!!!
	  });
  };

  init();

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
      sketch.totalLikes = sketch.totalLikes - 1;
      $('.heart.icon.sketch-icon').transition('jiggle');
      likeSvc.dislike({ sketch }).then((response) => {
        updateLikeStatusFor(sketch);
      });
    } else {
      sketch.isLiked = true;
      sketch.totalLikes = sketch.totalLikes + 1;
      $('.heart.icon.sketch-icon').transition('jiggle');
      likeSvc.like({ sketch }).then((response) => {
        updateLikeStatusFor(sketch);
      });
    }
  };

  $scope.search = () => {
    loadSketches(dateSearch, $scope.textSearch);
  };

  angular.element(document).ready(function () {
    $scope.confirmDeleteModal = $("#confirm-delete-modal");
  });

  (function rotateThumbnails(i) {
    if ($scope.sketches) {
      $scope.sketches.forEach((sketch) => {
        if (sketch.thumbnails.length) {
          sketch.shownThumbnail = sketch.thumbnails[i % sketch.thumbnails.length];
        } else {
          sketch.shownThumbnail = 'assets/no-preview.png';
        }
      });
    }

    $timeout(() => rotateThumbnails(i + 1), 1000);
  })(0);
}


gallery.controller('GalleryCtrl', [ "$scope", "authService", "sketchSvc", "$location", "$q", "likeSvc", "$timeout", GalleryCtrl]);
