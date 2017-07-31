'use strict';

angular.module('myApp.editor', [])

.controller('EditorCtrl', [ "$scope", "$routeParams", function($scope, $routeParams) {
  // $(document).ready(function () {
    var editor = ace.edit("editor");

    editor.setTheme("ace/theme/ambiance");
    editor.session.setMode("ace/mode/scala");

    let defaultScript = "def render = {\n\tdraw circle big\n}";

    editor.setValue($routeParams.script || defaultScript);
  // });
}]);