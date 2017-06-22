'use strict';

angular.module('myApp.gallery', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/callback', {
    templateUrl: 'callback/callback.html',
    controller: 'CallbackCtrl'
  })
}])

.controller('CallbackCtrl', [function() {

}]);