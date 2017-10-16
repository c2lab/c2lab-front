'use strict';

angular.module('myApp.social', []).controller('SocialCtrl', [
  "$scope", "authService", "followerSvc", "$q", "userSvc",
  function SocialCtrl($scope, authService, followerSvc, $q, userSvc) {
    let loadFolloweds = () => {
      authService.currentUser().then((user) => {
        followerSvc.find({ follower: user }).then((followeds) => {
          $scope.followeds = followeds;
        });
      });
    }

    loadFolloweds();

    $scope.search = () => {
      userSvc.find({ search: $scope.textSearch }).then((searchedUsers) => {
        $scope.searchedUsers = searchedUsers;
      });
    }
  }]);



