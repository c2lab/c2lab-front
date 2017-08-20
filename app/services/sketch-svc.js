'use strict';

angular.module('myApp.sketchSvc', []).service("sketchSvc", ['$q', '$http', '$feathers', function($q, $http, $feathers) {
  return {
    all: function({ user, date, search }) {
	    const sketchService = $feathers.service('sketches');
	    const query = {owner: user.user_id};
	    if (date) query.updated_at = { $gte: date };
	    //TODO: All this should work with an elasticsearch
	    if (search) query.$or = [{tags: {$in: search.split(/\W+/)}}, {$text: { $search: search}}];
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
    update: function(sketch_id, sketch){
      let deferred  = $q.defer();

      $http({
        method: 'PATCH',
        url: `${beURL}/sketches/${sketch_id}`,
        data: sketch
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
