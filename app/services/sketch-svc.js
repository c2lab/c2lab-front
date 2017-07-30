'use strict';

angular.module('myApp.sketchSvc', []).service("sketchSvc", function() {
  return {
    all: function(options) {
      let { user } = options;
      return [
        "assets/triangle.gif",
        "assets/triangle2.gif",
        "assets/triangle3.gif",
        "assets/triangle4.gif",
        "assets/triangle5.gif",
        "assets/triangle6.gif",
        "assets/triangle7.gif",
        "assets/triangle8.gif",
        "assets/triangle9.gif",
      ].map((path) => ({ path }));
    }
  };
});
