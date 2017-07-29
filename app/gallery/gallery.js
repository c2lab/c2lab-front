'use strict';

angular.module('myApp.gallery', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/gallery', {
    templateUrl: 'gallery/gallery.html',
    controller: 'GalleryCtrl'
  });
}])

.controller('GalleryCtrl', [ "$scope", "authService", function($scope, authService) {
  $scope.auth = authService

  $(document).ready(function() {
    $(".ui.dimmer").dimmer({
      on: "hover"
    })
  });
}]);