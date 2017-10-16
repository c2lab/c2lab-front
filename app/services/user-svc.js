'use strict';

angular.module('myApp.userSvc', []).service("userSvc", ['$feathers', function($feathers) {
  const userService = $feathers.service('users');

  const initUsers = (users) => users.map((user) => {
    user.avatar = user.avatar || 'assets/no-avatar.jpg';
    return user;
  });

  return {
    find: (search) => {
      return userService.find({ query: { nickname: search } }).then(({ data }) => initUsers(data));
    }
  };
}]);
