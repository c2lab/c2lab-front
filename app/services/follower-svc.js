'use strict';

angular.module('myApp.followerSvc', []).service("followerSvc", ['$q', '$feathers', function($q, $feathers) {
  const followerService = $feathers.service('followers');

  return {
    find: function({ follower }) {
      const query = {
        follower_id: follower.user_id
      };
      return followerService.find({ query }).then(({ data }) => data);
    },
    create: function({ follower, followed }) {
      let deferred = $q.defer();

      followerService.create({
        follower_id: follower.user_id,
        following_id: followed.user_id
      }).then(({ data }) => deferred.resolve(data));

      return deferred.promise;
    },
    delete: function({ follower, followed }) {
      let deferred = $q.defer();

      followerService.find({ query: {
        follower_id: follower.user_id,
        following_id: followed.user_id
      }}).then((response) => {
        followerService.remove(response.data[0]._id).then((result) => {
          deferred.resolve(result);
        })
      })

      return deferred.promise;
    }
  };
}]);
