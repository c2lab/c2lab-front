'use strict';

angular.module('myApp.examples', [])

.controller('ExamplesCtrl', [ "$scope", "$location", "authService", "sketchSvc", "$cacheFactory", "$interval",
  function($scope, $location, authService, sketchSvc, $cacheFactory, $interval) {
    //TODO: cambiar esta belleza por un usuario maestro como la gente
    const martinAccount = {user: {user_id: "google-oauth2|116674172420333857157" }};

    $scope.edit = ({_id}) => $location.path("/editor").search({sketch_id: _id, is_example: "true"});

    function init(){
      initExamples();
      initDimmers();
      const imgRotatorTimer = initImgs();

      $scope.$on('$destroy', () => $interval.cancel(imgRotatorTimer));
    }

    function initExamples() {
      // usamos cache para no hacer request cada vez
      const cache = $cacheFactory.get('cache') || $cacheFactory('cache');
      const cachedSketches = cache.get("sketches");

      if(cachedSketches) {
        $scope.examples = cachedSketches;
      }
      else {
        sketchSvc.all(martinAccount).then(sketches => {
          cache.put("sketches", sketches);

          $scope.$apply(() => ($scope.examples = sketches));
        });
      }
    }

    function initDimmers() {
      setTimeout(() => {
        const examples = $(".sketch-box");

        if(examples.length) {
          examples.dimmer({
            on: "hover"
          });
        }

        else initDimmers();
      }, 500);
    }

    function initImgs() {
      var rotatorIndex = 0;
      
      function rotateThumbnails(i) {
        if ($scope.examples) {
          $scope.examples.forEach((example) => {
            if (example.thumbnails.length) {
              example.shownThumbnail = example.thumbnails[i % example.thumbnails.length];
            } else {
              example.shownThumbnail = 'assets/no-preview.png';
            }
          });
        }
      }

      return $interval(() => rotateThumbnails(rotatorIndex++), 1000);
    }

    init();
  }
]);