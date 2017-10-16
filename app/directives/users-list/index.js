'use strict';

angular.module('myApp.usersList', []).directive("usersList", function() {
  return {
    scope: {
      title: '@',
      users: '=',
      noUsersMessage: '='
    },
    template: `
    <link rel="stylesheet" href="directives/users-list/index.css">
    <div class="ui attached segment social-container">
      <h3>
        {{title}}
      </h3>
      <div class="ui medium cards">

        <div class="ui card user-card" ng-repeat="user in users track by $index">
          <div class="blurring dimmable image">
            <div class="ui dimmer transition hidden user-box">
              <div class="content">
                <div class="center user-icons">
                  <h2 class="ui inverted header">{{user.name}}</h2>
                </div>
              </div>
            </div>
            <img class="bordered ui image thumbnail" ng-src="{{ user.avatar }}">
          </div>
        </div>
        <strong class="no-users-message" ng-if="!users.length && noUsersMessage">
          {{noUsersMessage}}
        </strong>

      </div>
    </div>`
  };
});