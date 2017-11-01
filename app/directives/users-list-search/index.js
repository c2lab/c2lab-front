'use strict';

angular.module('myApp.usersListSearch', []).directive("usersListSearch", function() {
  return {
    scope: {
      users: '=',
      noUsersMessage: '@',
      onFollow: '=',
      onUserClick: '=',
      loading: '='
    },
    template: `
	  <div class="ui divided list popup" ng-if="!loading">
		  <div class="item" ng-repeat="user in users track by $index">		      
		    <img class="ui avatar image" ng-src="{{ user.profile_picture || user.avatar }}">
		    {{ user.nickname }}
		    <div class="ui button" ng-click="onFollow(user)" ng-if="!user.isFollowed">Add</div>
		    <div class="ui button" ng-click="onFollow(user)" ng-if="user.isFollowed">Remove</div>
		  </div>
	    <div ng-if="!users.length && noUsersMessage">
	        {{noUsersMessage}}
	    </div>
    </div>
    <div class="ui active loader" ng-if="loading"></div>
    `
  };
});