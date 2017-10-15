'use strict';

angular.module('myApp.social', []).controller('SocialCtrl', [
  "$scope", "authService", "followerSvc", "$q",
  function SocialCtrl($scope, authService, followerSvc, $q) {
    let loadFolloweds = () => {
      authService.currentUser().then((user) => {
        followerSvc.find({ follower: user }).then((followeds) => {
          $scope.followeds = followeds;
        });
      });
    }

    loadFolloweds();
  }]);



