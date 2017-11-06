'use strict';

angular.module('myApp.usersList', []).directive("usersList", function() {
  return {
    scope: {
      title: '@',
      users: '=',
      noUsersMessage: '@',
      onFollow: '=',
      onUserClick: '=',
      loading: '='
    },
    template: `
    <link rel="stylesheet" href="directives/users-list/index.css">
    <div class="ui attached segment social-container">
      <h3>
        {{title}}
      </h3>
      <div class="ui active loader" ng-if="loading"></div>
      <div class="ui medium cards" ng-if="!loading">

        <div class="ui card user-card" ng-repeat="user in users track by $index">
          <div class="blurring dimmable image">
            <div class="ui dimmer transition hidden user-box">
              <div class="content">
                <div class="center user-icons">
                  <a>
                    <h2
                      class="ui inverted header"
                      ng-click="onUserClick(user)">
                      {{user.nickname}}
                    </h2>
                  </a>
                  <i class="icon user-icon" ng-class="{ add: !user.isFollowed, user: !user.isFollowed, trash: user.isFollowed }" ng-click="onFollow(user)"></i>
                </div>
              </div>
            </div>
            <img class="bordered ui image thumbnail" ng-src="{{ user.profile_picture || user.avatar }}">
          </div>
        </div>
        <strong class="no-users-message" ng-if="!users.length && noUsersMessage">
          {{noUsersMessage}}
        </strong>

      </div>
    </div>`
  };
});