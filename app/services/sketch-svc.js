'use strict';

angular.module('myApp.sketchSvc', []).service("sketchSvc", ['$q', '$http', '$feathers', function($q, $http, $feathers) {
  return {
    all: function({ user, date }) {
	    var sketchService = $feathers.service('sketches')
	    const query = {owner: user.user_id};
	    if (date) query.updated_at = { $gte: date };
	    return sketchService.find({ query }).then((x) => x.data);
    },
    create: function(sketch) {
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
    },
    find: function(id) {
      let deferred  = $q.defer();

      $http({
        method: 'GET',
        url: `${beURL}/sketches`,
        params: { _id: id }
      }).then(({ data }) => {
        deferred.resolve(data.data[0]);
      }, (e) => {
        deferred.reject(e);
      });

      return deferred.promise;
    },
    update: function({ sketch_id, code, title, tags }){
      let deferred  = $q.defer();

      $http({
        method: 'PATCH',
        url: `${beURL}/sketches/${sketch_id}`,
        data: { code, title, tags }
      }).then(({ data }) => {
        deferred.resolve(data);
      }, (e) => {
        deferred.reject(e);
      });

      return deferred.promise;
    },
    delete: function(id) {
      let deferred  = $q.defer();

      $http({
        method: 'DELETE',
        url: `${beURL}/sketches`,
        params: { _id: id }
      }).then(({ data }) => {
        deferred.resolve(data[0]);
      }, (e) => {
        deferred.reject(e);
      });

      return deferred.promise;
    }
  };
}]);
