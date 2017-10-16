'use strict';

angular.module('myApp.social', []).controller('SocialCtrl',
  ["$scope", "authService", "followerSvc", "$q", "userSvc",
  function SocialCtrl($scope, authService, followerSvc, $q, usersService) {
    let loadFolloweds = () => {
      authService.currentUser().then((user) => {
        followerSvc.find({ follower: user }).then((followeds) => {
          const ids = followeds.map(({following_id}) => following_id).filter(id => id);
          if (ids.length) {
            usersService.findByIds(ids).then((followed_users) => {
              $scope.followeds = followed_users;
              updateFollowStatus($scope.followeds)
              initUsersList();
              $scope.$apply();
            })
          } else {
            $scope.followeds = [];
          }
        });
      });
    }

    loadFolloweds();

    $scope.search = () => {
      $scope.searchedText = $scope.textSearch;
      usersService.find($scope.textSearch).then((searchedUsers) => {
        $scope.searchedUsers = searchedUsers;
        updateFollowStatus($scope.searchedUsers)
        initUsersList();
        $scope.$apply()
      });
    };

    $scope.switchFollow = (user) => {
      authService.currentUser().then((me) => {
        let promise;
        if(user.isFollowed) {
          promise = followerSvc.delete({followed: user, follower: me})
        } else {
          promise = followerSvc.create({followed: user, follower: me})
        }
        promise.then(() => {
          updateFollowStatus([user]);
        })
      });
    };

    const initUsersList = () => {
      $(document).ready(function () {
        $(".user-box").dimmer({
          on: "hover"
        });
      });
    }

    const updateFollowStatus = (users) => {
      authService.currentUser().then((me) => {
        followerSvc.find({ follower: me }).then((follows) => {
          const ids = follows.map(({ following_id }) => following_id)
          users.forEach(user => {
            user.isFollowed = ids.some(id => id === user.user_id);
          });
          $scope.$apply();
        });
      });
    }
  }]);



