'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'auth0.auth0',
  'paypal-button',
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
  '$routeProvider',
  '$httpProvider', function($angularAuthProvider, $locationProvider, $routeProvider, $httpProvider) {

  $angularAuthProvider.init({
    clientID: 'VUs3zBHunPr1YqUooaqN0D1g9IaACyoH',
    domain: 'c2lab.auth0.com',
    responseType: 'token id_token',
    audience: 'https://c2lab.auth0.com/userinfo',
    redirectUri: window.location.href,
    scope: 'openid'
  });
    
  $locationProvider.hashPrefix('!');

  function checkUserSession(authService, $location){
    if (authService.isAuthenticated()) {
      $httpProvider.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.id_token}` };
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
    .otherwise({redirectTo: '/gallery'});

}])
    
.controller("mainCtrl", [ "$scope", "authService", function ($scope, authService) {
  $scope.isAuthenticated = () => {
    return authService.isAuthenticated()
  };
  $scope.logout = () => authService.logout();

  $scope.paypal = {
    env: 'sandbox',
    client: {
        sandbox:    'AVZkdF57wtyVstw9mz8R3dRsIZTlMoYwNGzxaJfWCK3YMU0Z230wDlBlHw4h6QvMvvs2xC5E5SYR0Evr'
    },
    payment: function() {
        var env    = this.props.env;
        var client = this.props.client;
        return paypal.rest.payment.create(env, client, {
            transactions: [
                {
                    amount: { total: '0.01', currency: 'USD' }
                }
            ]
        });
    },
    commit: true, // Optional: show a 'Pay Now' button in the checkout flow
    onAuthorize: function(data, actions) {
        // Optional: display a confirmation page here
        console.log("confirm")
        return actions.payment.execute().then(function() {
            // Show a success page to the buyer
            console.log("Success")
        });
    }
  };
}])
    
.service("authService", ["angularAuth0", "$location", "$q", "$http", function authService(angularAuth0, $location, $q, $http) {

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

  function currentUser() {
    let deferred = $q.defer();

    $http({
      method: 'GET',
      url: `${beURL}/users/me`
    }).then(({ data }) => deferred.resolve(data), (error) => deferred.reject(error));

    return deferred.promise;
  }

  return {
    isAuthenticated,
    logout,
    currentUser
  }
}])