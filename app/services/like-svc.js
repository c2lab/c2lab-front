'use strict';

angular.module('myApp.sketchSvc', []).service("sketchSvc", ['$q', '$http', function($q, $http) {
  return {
    like: function({ user }) {
      let deferred  = $q.defer();

      $http({
        method: 'POST',
        url: `${beURL}/sketches`,
        params: { owner: user.user_id }
      }).then(({ data }) => {
        deferred.resolve(data);
      }, (e) => {
        deferred.reject(e);
      });

      return deferred.promise;
    },
    dislike: function(sketch) {
      let deferred  = $q.defer();

      $http({
        method: 'POST',
        url: `${beURL}/sketches`,
        data: sketch
      }).then(({ data }) => {
        deferred.resolve(data);
      }, (e) => {
        deferred.reject(e);
      });

      return deferred.promise;
    }
  };
}]);
