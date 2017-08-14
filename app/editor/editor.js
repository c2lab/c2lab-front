'use strict';

angular.module('myApp.editor', [])

  .controller('EditorCtrl', ["$scope", "$routeParams", "$http", "sketchSvc",
    function ($scope, $routeParams, $http, sketchSvc) {
      $scope.getPreview = function () {
        $("#previewPanel").addClass("open");

        $http.post(beURL + "/sketches/preview", {
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

      $scope.openModal = () => {
        $scope.modal.modal("show");
      }

      $scope.canSave = () => $scope.title;

      $scope.save = () => {
        if ($scope.sketch_id) {
          sketchSvc.update({
            title: $scope.title,
            code: editor.getValue(),
            sketch_id: $scope.sketch_id
          }).then((sketch) => {
            console.log(`${sketch.title} was successfully updated.`)
          });
        } else {
          sketchSvc.create({title: $scope.title, code: editor.getValue()}).then((sketch) => {
            console.log(`${sketch.title} was successfully created.`)
          });
        }
      }

      var editor = ace.edit("editor");

      editor.setTheme("ace/theme/ambiance");
      editor.session.setMode("ace/mode/scala");

      if ($routeParams.sketch_id) {
        sketchSvc.find($routeParams.sketch_id).then(({title, code}) => {
          $scope.sketch_id = $routeParams.sketch_id;
          $scope.title = title;
          editor.setValue(code);
        });
      } else if ($routeParams.script) {
        editor.setValue($routeParams.script || defaultScript);
      } else {
        let defaultScript = "Setup._2D.LeftBottom.asCanvas\r\n  RectMode.leftBottom\r\n\r\n  def render():Unit = {\r\n    val pos = new Vector3(mouseX - (mouseX % 50), 0, 0)\r\n    \/\/Wold be great to reeplace materialize with implicit conversion\r\n    rect(pos,50,height, Palette.iDemandPancake.getRandom.toMeshBasicMaterial())\r\n   }";
        editor.setValue(defaultScript);
      }

      angular.element(document).ready(function () {
        $scope.modal = $("#save-modal").modal('setting', {
          onApprove: () => {
            $scope.save();
          }
        });
      });

    }])
