'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'auth0.auth0',
  'ngRoute',
  'myApp.gallery',
  'myApp.view1',
  'myApp.view2',
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

  $routeProvider.otherwise({redirectTo: '/gallery'});
}])
    
.controller("mainCtrl", [ "$scope", "authService", function ($scope, authService) {
  $scope.auth = authService
}])
    
.service("authService", ["angularAuth0", function authService(angularAuth0) {

  // function handleAuthentication() {
  //   angularAuth0.parseHash(function(err, authResult) {
  //     if (authResult && authResult.accessToken && authResult.idToken) {
  //       setSession(authResult);
  //       $state.go('home');
  //     } else if (err) {
  //       $timeout(function() {
  //         $state.go('home');
  //       });
  //       console.log(err);
  //     }
  //   });
  // }
  //
  // function setSession(authResult) {
  //   // Set the time that the access token will expire at
  //   let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
  //   localStorage.setItem('access_token', authResult.accessToken);
  //   localStorage.setItem('id_token', authResult.idToken);
  //   localStorage.setItem('expires_at', expiresAt);
  // }
  //
  // function logout() {
  //   // Remove tokens and expiry time from localStorage
  //   localStorage.removeItem('access_token');
  //   localStorage.removeItem('id_token');
  //   localStorage.removeItem('expires_at');
  // }
  //
  // function isAuthenticated() {
  //   // Check whether the current time is past the
  //   // access token's expiry time
  //   let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
  //   return new Date().getTime() < expiresAt;
  // }

  function login() {
    angularAuth0.authorize();
  }

  return {
    // handleAuthentication: handleAuthentication,
    // isAuthenticated: isAuthenticated,
    // logout: logout,
    login: login
  }
}])