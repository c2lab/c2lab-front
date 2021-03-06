'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'auth0.auth0',
  'paypal-button',
  'ngRoute',
  'myApp.navbar',
  'myApp.gallery',
  'myApp.social',
  'myApp.sketchSvc',
  'myApp.editor',
  'myApp.examples',
  'myApp.followerSvc',
  'myApp.userSvc',
  'myApp.usersList',
  'myApp.version',
  'myApp.likeSvc',
  'myApp.gistSvc',
	'ngFeathers'
])

.config([
  'angularAuth0Provider',
  '$locationProvider',
  '$routeProvider',
  '$httpProvider',
  '$windowProvider', '$feathersProvider', function($angularAuthProvider, $locationProvider, $routeProvider, $httpProvider, $windowProvider, $feathersProvider) {

  $angularAuthProvider.init({
    clientID: 'VUs3zBHunPr1YqUooaqN0D1g9IaACyoH',
    domain: 'c2lab.auth0.com',
    responseType: 'token id_token',
    audience: 'https://c2lab.auth0.com/userinfo',
    redirectUri: $windowProvider.$get().location.origin + "/app",
    scope: 'openid'
  });

	$feathersProvider.setEndpoint(beURL);
	$feathersProvider.useSocket(false);
	$feathersProvider.setAuthStorage(localStorage);

  $locationProvider.hashPrefix('!');

  function checkUserSession(authService, $location){

    if (authService.isAuthenticated()) {
      $httpProvider.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.id_token}` };
	    $.ajaxSetup({
		    headers: { 'Authorization': `Bearer ${localStorage.id_token}` }
	    });
      return true;
    } else {
      $location.path("/login")
    }
  }

  $routeProvider
    .when('/login', {
      resolve: {
        factory: function(angularAuth0, $q, $location, authService) {
          function getFromUrl(param) {
            let match = $location.url().match(new RegExp(`${param}=([^&]+)`));
            return match && match[1];
          }

          let deferred = $q.defer();
          if (authService.isAuthenticated()) {
            $location.path('/gallery');
            deferred.resolve(true);
          } else {
            angularAuth0.parseHash(function(err, authResult) {
              if (authResult && authResult.idToken) {
                let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
                localStorage.setItem('access_token', authResult.accessToken || getFromUrl('access_token'));
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
    .when('/social', {
      templateUrl: 'social/index.html',
      controller: 'SocialCtrl',
      resolve: {
        factory: checkUserSession
      }
    })
    .otherwise({redirectTo: '/gallery'});

}])

.controller('mainCtrl', [ '$scope', 'authService', function ($scope, authService) {
  $scope.isAuthenticated = () => {
    return authService.isAuthenticated()
  };
}])

.controller('navbarCtrl', ['$scope', 'authService', function($scope, authService) {
  $scope.logout = () => authService.logout();

  $(document).ready(() => {
    authService.currentUser().then((user) => {
      $scope.userId = user.user_id;
      $scope.showPayment = user.user_type === 'STD';
    });
    $scope.notifyUrl = `${ipnURL}/ipn`;
  });    
}])

.service("authService", ["angularAuth0", "$location", "$q", "$http", "$window", function authService(angularAuth0, $location, $q, $http, $window) {

  function logout() {
    removeSession();
    angularAuth0.logout({ returnTo: $window.location.origin });
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

  let user;
  function currentUser() {
    let deferred = $q.defer();

    if (user) {
      deferred.resolve(user);
    } else {
      $http({
        method: 'GET',
        url: `${beURL}/users/me`
      }).then(({ data }) => {
        user = data;
        deferred.resolve(data);
      }, (error) => deferred.reject(error));
    }

    return deferred.promise;
  }

  return {
    isAuthenticated,
    logout,
    currentUser
  }
}])