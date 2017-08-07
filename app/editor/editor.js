'use strict';

angular.module('myApp.editor', [])

.controller('EditorCtrl', [ "$scope", "$routeParams", "$http", function($scope, $routeParams, $http) {

    $scope.getPreview = function () {
        $http.post("http://localhost:3000/sketches/5959ac10c62d540f713bd55f/preview", {
                code: editor.getValue()
            })
           .then(function (previewResponse) {
               $("#previewIframe")
                   .show()
                   .attr("src",
                       "data:text/html;charset=utf-8," + encodeURIComponent(previewResponse.data.code
                   ));
           });
    };

    var editor = ace.edit("editor");

    editor.setTheme("ace/theme/ambiance");
    editor.session.setMode("ace/mode/scala");

    let defaultScript = "Setup._2D.LeftBottom.asCanvas\r\n  RectMode.leftBottom\r\n\r\n  def render():Unit = {\r\n    val pos = new Vector3(mouseX - (mouseX % 50), 0, 0)\r\n    \/\/Wold be great to reeplace materialize with implicit conversion\r\n    rect(pos,50,height, Palette.iDemandPancake.getRandom.toMeshBasicMaterial())\r\n   }";

    editor.setValue($routeParams.script || defaultScript);
}])