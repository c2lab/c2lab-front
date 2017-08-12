'use strict';

angular.module('myApp.likeSvc', []).service("likeSvc", ['$q', '$http', 'authService', function($q, $http, authService) {
  return {
    like: function({ sketch }) {
      let deferred  = $q.defer();

      authService.currentUser().then((user) => {
        $http({
          method: 'POST',
          url: `${beURL}/likes`,
          data: { sketch_id: sketch._id, liker_id: user.user_id }
        }).then(({ data }) => {
          deferred.resolve(data[0]);
        }, (e) => {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    },
    dislike: function({ sketch }) {
      let deferred  = $q.defer();

      authService.currentUser().then((user) => {
        $http({
          method: 'DELETE',
          url: `${beURL}/likes`,
          data: { liker_id: user.user_id, sketch_id: sketch._id }
        }).then(({ data }) => {
          deferred.resolve(data[0]);
        }, (e) => {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    },
    find: function({ user, sketch }) {
      let deferred  = $q.defer();

      $http({
        method: 'GET',
        url: `${beURL}/likes`,
        params: { liker_id: user.user_id, sketch_id: sketch._id }
      }).then(({ data }) => {
        deferred.resolve(data.data[0]);
      }, (e) => {
        deferred.reject(e);
      });

      return deferred.promise;
    },
    sketchTotal: function({ sketch }) {
      let deferred  = $q.defer();

      $http({
        method: 'GET',
        url: `${beURL}/likes`,
        params: { sketch_id: sketch._id, $limit: 0 }
      }).then(({ data }) => {
        deferred.resolve(data.total);
      }, (e) => {
        deferred.reject(e);
      });

      return deferred.promise;
    },
    myLikesFor: function({ sketches }) {
      let deferred  = $q.defer();

      authService.currentUser().then((user) => {
        $http({
          method: 'GET',
          url: `${beURL}/likes`,
          params: { liker_id: user.user_id, sketch_id: sketches.map(({ _id }) => _id) }
        }).then(({ data }) => {
          deferred.resolve(data.data);
        }, (e) => {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }
  };
}]);
