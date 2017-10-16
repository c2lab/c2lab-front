'use strict';

angular.module('myApp.social', []).controller('SocialCtrl', ["$scope", "authService", "followerSvc", "$q", "$feathers",
  function SocialCtrl($scope, authService, followerSvc, $q, $feathers) {
	  const usersService = $feathers.service('users');

	  usersService.find({}).then(console.log);

    let loadFolloweds = () => {
      authService.currentUser().then((user) => {
        followerSvc.find({ follower: user }).then((followeds) => {
          $scope.followeds = followeds;
        });
      });
    }

    loadFolloweds();

    $scope.search = () => {
      usersService.find({ search: $scope.textSearch }).then((searchedUsers) => {
        $scope.searchedUsers = searchedUsers;
      });
    }
  }]);



