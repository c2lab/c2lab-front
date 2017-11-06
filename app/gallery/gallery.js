'use strict';

angular.module('myApp.gallery', []).controller('GalleryCtrl', [
  "$scope", "authService", "sketchSvc", "$location", "$q", "likeSvc", "gistSvc", "$timeout", "$routeParams", "userSvc",
  function GalleryCtrl($scope, authService, sketchSvc, $location, $q, likeSvc, gistSvc, $timeout, $routeParams, userSvc) {
    function showActionsOnHover() {
      $(document).ready(function () {
        $(".sketch-box").dimmer({
          on: "hover"
        });

        $('.share').popup({
          content: 'Link copiado en el portapapeles',
          on: 'click',
          onVisible: () => {
            _.delay(() => $('.share').popup('hide'), 1000);
          }
        });
      });
    }

    const getGalleryOwner = () => {
      const deferred = $q.defer();

      let promise;
      if ($routeParams.user_id) {
        promise = userSvc.findById($routeParams.user_id);
      } else {
        $scope.ownGallery = true;
        promise = authService.currentUser();
      }

      promise.then((owner) => {
        $scope.ownerNickname = owner.nickname;
        deferred.resolve(owner)
      });

      return deferred.promise;
    }

    let updateLikeStatus = () => {
      return likeSvc.myLikesFor({sketches: $scope.sketches}).then((likes) => {
        $scope.sketches.forEach((sketch) => {
          let like = likes.find(({sketch_id}) => sketch_id === sketch._id);
          likeSvc.sketchTotal({sketch}).then((total) => {
            sketch.isLiked = !!like;
            sketch.totalLikes = total;
          });
        });
      });
    }

    const updateLikeStatusFor = (sketch) => {
      return likeSvc.myLikeFor({sketch}).then((like) => {
        likeSvc.sketchTotal({sketch}).then((total) => {
          sketch.isLiked = !!like;
          sketch.totalLikes = total;
        });
      });
    };

    const loadSketches = (date, search) => {
      $scope.loadingSketches = true;
      getGalleryOwner().then((user) => {
        sketchSvc.all({user, date, search}).then((sketches) => {
          $scope.sketches = sketches;
          updateLikeStatus().then((sketch) => {
            showActionsOnHover();
            $scope.loadingSketches = false;
          });
        });

        authService.currentUser().then((currentUser) => {
          let isOwner = ({owner}) => owner === currentUser.user_id;
          $scope.canEdit = isOwner;
          $scope.canRemove = isOwner;
        });
      });
    };

    let dateSearch;

    const init = () => {
      $(document).ready(() => {
        $('#date.ui.dropdown').dropdown({
          onChange: (value, text, $selectedItem) => {
            const actions = {
              "hoy": () => moment().startOf('day').toDate().getTime(),
              "esta semana": () => moment().startOf('isoweek').toDate().getTime(),
              "este mes": () => moment().startOf('month').toDate().getTime(),
              "este año": () => moment().startOf('year').toDate().getTime(),
              "desde el comienzo": () => null
            };
            dateSearch = actions[value]();
            loadSketches(dateSearch, $scope.textSearch);
          }
        });
        $('#search').keyup(_.debounce($scope.search, 500));
        new Clipboard('.share');
      });
    };

    $scope.search = () => {
      loadSketches(dateSearch, $scope.textSearch);
    };

    init();

    loadSketches();

    $scope.edit = ({_id}) => $location.path("/editor").search({sketch_id: _id});

    $scope.copy = ({ _id }) => $location.path("/editor").search({copied_sketch_id: _id});

    $scope.delete = ({_id}) => {
      $scope.confirmDeleteModal.modal({blurring: true,
        onApprove: () => {
          sketchSvc.delete(_id).then(({title}) => {
            console.log(`${title} was correctly deleted.`);
            loadSketches();
          });
        }
      }).modal("show");
    }

    $scope.gistLinkFor = (sketch) => {
      let gistIconId = "#gist" + sketch._id;
      
      if (sketch.gistLinkReady) {
        new Clipboard(gistIconId);

        $(gistIconId).popup({
          content: 'Link copiado en el portapapeles',
          onVisible: () => {
            _.delay(() => $(gistIconId).popup('destroy'), 1000);
          }
        }).popup('show');
      } else {
        gistSvc
          .getShareLinkFor(sketch)
          // .catch((x) => "asd")
          .then((link) => {
            sketch.gistLinkReady = true;

            //TODO: hacer que ande esta mierda, el navegador no llega
            //TODO: setear el atributo antes de poder leer el puto link
            $("#gist" + sketch._id).attr("data-clipboard-text", link);
          });
      }
    }

    $scope.shareLink = (sketchId) => `${window.beURL}/sketches/showcase/${sketchId}`;

    $scope.switchLike = _.debounce((sketch) => {
      sketch.isLiked = !sketch.isLiked;
      $('.heart.icon.sketch-icon').transition('jiggle');
      sketch.totalLikes += sketch.isLiked ? 1 : -1;
      (sketch.isLiked ? likeSvc.like({sketch}) : likeSvc.dislike({sketch})).then(() => {
        updateLikeStatusFor(sketch);
      });
    }, 500, {leading: true});

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
  }]);



