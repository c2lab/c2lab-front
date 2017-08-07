'use strict';

angular.module('myApp.sketchSvc', []).service("sketchSvc", ['$q', '$http', function($q, $http) {
  return {
    all: function(options) {
      let { user } = options;
      let deferred  = $q.defer();

      $http({
        method: 'GET',
        url: "http://localhost:3000/sketches"
      }).then(({ sketches }) => {
        deferred.resolve(sketches);
      }, (e) => {
        deferred.reject(e);
      });

      return deferred.promise;
    }
  };
}]);
