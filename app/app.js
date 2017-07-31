'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'auth0.auth0',
  'ngRoute',
  'myApp.navbar',
  'myApp.gallery',
  'myApp.sketchSvc',
  'myApp.editor',
  'myApp.examples',
  'myApp.exampleSvc',
  'myApp.version'
])
    
.config([
  'angularAuth0Provider',
  '$locationProvider',
  '$routeProvider', function($angularAuthProvider, $locationProvider, $routeProvider) {

  $angularAuthProvider.init({
    clientID: 'VUs3zBHunPr1YqUooaqN0D1g9IaACyoH',
    domain: 'c2lab.auth0.com',
    responseType: 'token id_token',
    audience: 'https://c2lab.auth0.com/userinfo',
    redirectUri: 'http://localhost:8000',
    scope: 'openid'
  });
    
  $locationProvider.hashPrefix('!');

  function checkUserSession(authService, $location){
    if (authService.isAuthenticated()) {
      return true;
    } else {
      $location.path("/login")
    }
  }

  $routeProvider
    .when('/login', {
      resolve: {
        factory: function(angularAuth0, $q, $location, authService) {
          let deferred = $q.defer();
          if (authService.isAuthenticated()) {
            $location.path('/gallery');
            deferred.resolve(true);
          } else {
            angularAuth0.parseHash(function(err, authResult) {
              if (authResult && authResult.idToken) {
                let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
                localStorage.setItem('access_token', authResult.accessToken);
                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('expires_at', expiresAt);
                $location.path('/gallery');
              } else {
                angularAuth0.authorize();
              }
              deferred.resolve(true);
            });
          }
          return deferred.promise;
        }
      }
    })
    .when('/gallery', {
      templateUrl: 'gallery/gallery.html',
      controller: 'GalleryCtrl',
      resolve: {
        factory: checkUserSession
      }
    })
    .when('/examples', {
      templateUrl: 'examples/examples.html',
      controller: 'ExamplesCtrl',
      resolve: {
        factory: checkUserSession
      }
    })
    .when('/editor', {
      templateUrl: 'editor/editor.html',
      controller: 'EditorCtrl',
      resolve: {
        factory: checkUserSession
      }
    })
    .otherwise({redirectTo: '/gallery'});
}])
    
.controller("mainCtrl", [ "$scope", "authService", function ($scope, authService) {
  $scope.isAuthenticated = () => {
    return authService.isAuthenticated()
  };
  $scope.logout = () => authService.logout();
}])
    
.service("authService", ["angularAuth0", "$location", function authService(angularAuth0, $location) {

  function logout() {
    removeSession();
    angularAuth0.logout();
  }

  function removeSession(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  return {
    isAuthenticated,
    logout
  }
}])
