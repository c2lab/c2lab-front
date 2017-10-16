'use strict';

angular.module('myApp.social', []).controller('SocialCtrl',
  ["$scope", "authService", "followerSvc", "$q", "$feathers", "userSvc",
  function SocialCtrl($scope, authService, followerSvc, $q, $feathers, usersService) {
    let loadFolloweds = () => {
      authService.currentUser().then((user) => {
        followerSvc.find({ follower: user }).then((followeds) => {
          $scope.followeds = followeds;
          initUsersList();
        });
      });
    }

    loadFolloweds();

    $scope.search = () => {
      $scope.searchedText = $scope.textSearch;
      usersService.find($scope.textSearch).then((searchedUsers) => {
        $scope.searchedUsers = searchedUsers;
        initUsersList();
        $scope.$apply()
      });
    }

    const initUsersList = () => {
      $(document).ready(function () {
        $(".user-box").dimmer({
          on: "hover"
        });
      });
    }
  }]);



