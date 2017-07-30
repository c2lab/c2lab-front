'use strict';

angular.module('myApp.editor', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/editor', {
    templateUrl: 'editor/editor.html',
    controller: 'EditorCtrl'
  });
}])

.controller('EditorCtrl', [ "$scope", "$routeParams", function($scope, $routeParams) {
  // $(document).ready(function () {
    var editor = ace.edit("editor");

    editor.setTheme("ace/theme/ambiance");
    editor.session.setMode("ace/mode/scala");

    let defaultScript = "def render = {\n\tdraw circle big\n}";

    editor.setValue($routeParams.script || defaultScript);
  // });
}]);