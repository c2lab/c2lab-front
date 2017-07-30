'use strict';

angular.module('myApp.gallery', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/gallery', {
    templateUrl: 'gallery/gallery.html',
    controller: 'GalleryCtrl'
  });
}])

.controller('GalleryCtrl', [ "$scope", "authService", "sketchSvc", function($scope, authService, sketchSvc) {
  $scope.sketchs = sketchSvc.all({ user: authService.user });

  $(document).ready(function() {
    $(".ui.dimmer").dimmer({
      on: "hover"
    })
  });
}]);