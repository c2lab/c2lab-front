'use strict';

angular.module('myApp.exampleSvc', []).service("exampleSvc", function() {
  return {
    all: function() {
      let script = "def render = {\n\t//Example script!\n}",
        title = "Example";

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
      ].reverse().map((previewPath) => ({ previewPath, script, title }));
    }
  };
});