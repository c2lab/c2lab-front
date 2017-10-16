'use strict';

angular.module('myApp.userSvc', []).service("userSvc", ['$feathers', function($feathers) {
  const userService = $feathers.service('users');

  const initUsers = (users) => users.map((user) => {
    user.avatar = user.avatar || 'assets/no-avatar.jpg';
    return user;
  });

  return {
    find: (search) => {
      let query = {};
      if (search) query.nickname = search;
      return userService.find({ query }).then(({ data }) => initUsers(data));
    },
    findByIds: (ids) => {
      const query = {
        user_id: { $in: ids }
      };
      return userService.find({ query }).then(({ data }) => initUsers(data));
    }
  };
}]);
