'use strict';

angular.module('myApp.userSvc', []).service("userSvc", ['$q', '$http', '$feathers', function($q, $http, $feathers) {
  const userService = $feathers.service('users');

  return {
    find: ({ search }) => {
      const query = { user_id: search };

      return $http({
        method: 'GET',
        url: `${beURL}/users`,
        params: query
      }).then(({ data }) => data);
    }
  };
}]);
