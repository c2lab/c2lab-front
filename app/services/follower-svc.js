'use strict';

angular.module('myApp.followerSvc', []).service("followerSvc", ['$http', function($http) {
  return {
    find: function({ follower }) {
      return $http({
        method: 'GET',
        url: `${beURL}/followers`,
        params: { follower_id: follower.user_id }
      }).then(({ data }) => {
        return data.data[0];
      });
    }
  };
}]);
