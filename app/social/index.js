'use strict';

angular.module('myApp.social', []).controller('SocialCtrl',
  ["$scope", "authService", "followerSvc", "$q", "userSvc", "$location",
  function SocialCtrl($scope, authService, followerSvc, $q, usersService, $location) {
    let loadFolloweds = () => {
      $scope.loadingFolloweds = true;
      
      authService.currentUser().then((user) => {
        followerSvc.find({ follower: user }).then((followeds) => {
          const ids = followeds.map(({following_id}) => following_id).filter(id => id);
          if (ids.length) {
            usersService.findByIds(ids).then((followed_users) => {
              $scope.followeds = followed_users;
              updateFollowStatus($scope.followeds)
              initUsersList();
              $scope.loadingFolloweds = false;
              $scope.$apply();
            })
          } else {
            $scope.followeds = [];
            $scope.loadingFolloweds = false;
            $scope.$apply();
          }
        });
      });
    }

    loadFolloweds();

    $scope.search = () => {
      $scope.loadingSearchedUsers = true;
      $scope.searchedText = $scope.textSearch;
      usersService.find($scope.textSearch).then((searchedUsers) => {
        $scope.searchedUsers = searchedUsers;
        updateFollowStatus($scope.searchedUsers)
        initUsersList();
        $scope.loadingSearchedUsers = false;
        $scope.$apply()
      });
    };

    $scope.switchFollow = (user) => {
      authService.currentUser().then((me) => {
      	const data = { followed: user, follower: me };
	      (user.isFollowed ? followerSvc.delete(data) : followerSvc.create(data)).then(() => {
          updateFollowStatus($scope.searchedUsers);
	        loadFolloweds();
        })
      });
    };

    $scope.goToGallery = (user) => {
      $location.path('/gallery').search({ user_id: user.user_id });
    };

    const initUsersList = () => {
      $(document).ready(function () {
        $(".user-box").dimmer({
          on: "hover"
        });
      });
    }

    $(document).ready(() => {
	    $('.ui.search')
		    .search({
			    apiSettings: {
				    url: `${beURL}/users?nickname={query}`
			    },
			    fields: { results: "data" },
			    templates: {
				    userSearch: function (response) {
					    return response.data.map(user =>
						    `<div class="item">
                              <img class="ui avatar image" src="${user.profile_picture || user.avatar}">
                              
                              <div class="content">${user.nickname}</div>
                              
                              <div class="right floated content">
                                  <div ng-click="onFollow(user)" class="ui button tiny"> ${user.isFollowed ? "Quitar" : "Agregar" }</div>
                              </div>
						    </div>`
					    ).join();
					    // <img class="ui avatar image" ng-src="${user.profile_picture || user.avatar}">
					    //  {{ user.nickname }}
					    // <div class="ui button" ng-click="onFollow(user)" ng-if="!user.isFollowed">Add</div>
					    //  <div class="ui button" ng-click="onFollow(user)" ng-if="user.isFollowed">Remove</div>
				    }
			    },
			    type: 'userSearch'
		    });
    });

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



