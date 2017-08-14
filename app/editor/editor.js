'use strict';

angular.module('myApp.editor', [])

  .controller('EditorCtrl', ["$scope", "$routeParams", "$http", "sketchSvc",
    function ($scope, $routeParams, $http, sketchSvc) {
      $scope.getPreview = function () {
        $("#previewPanel").addClass("open");
        $("#previewIframe").removeAttr("src");

        $http.post(beURL + "/sketches/preview", {
            code: editor.getValue()
          })
          .then(function (previewResponse) {
            $("#previewIframe")
              .attr("src",
                "data:text/html;charset=utf-8," + encodeURIComponent(previewResponse.data.code)
              );
          });
      };

    $scope.openModal = () => {
			if (currentSketch) loadSketch();
      $scope.modal.modal("show");
    }

      $scope.canSave = () => $scope.title;

    $scope.save = () => {
      if ($scope.sketch_id) {
        sketchSvc.update({ title: $scope.title, code: editor.getValue(), sketch_id: $scope.sketch_id, tags: $scope.tags }).then((sketch) => {
          console.log(`${sketch.title} was successfully updated.`)
        });
      } else {
        sketchSvc.create({ title: $scope.title, code: editor.getValue(), tags: $scope.tags}).then((sketch) => {
          console.log(`${sketch.title} was successfully created.`)
        });
      }
    }

    $scope.currentTags = [];

    $scope.removeTag = (index) => {
    	//TODO: Tags should be a set
		  $scope.tags = $scope.tags.filter((_, i) => i !== index);
	  }

	  $scope.addTag = () => {
		  $scope.tags = $scope.tags.slice();
		  $scope.tags.push($scope.tag);
	  };

    var editor = ace.edit("editor");

      editor.setTheme("ace/theme/ambiance");
      editor.session.setMode("ace/mode/scala");

    var currentSketch;

    const loadSketch =  () => {
	    currentSketch.then(({ title, code, tags }) => {
		    $scope.sketch_id = $routeParams.sketch_id;
		    $scope.title = title;
		    $scope.tags = tags;
		    editor.setValue(code);
	    });
    }

    if ($routeParams.sketch_id) {
	    currentSketch = sketchSvc.find($routeParams.sketch_id);
	    loadSketch();
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
