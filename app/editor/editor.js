'use strict';

angular.module('myApp.editor', [])

  .controller('EditorCtrl', ["$scope", "$routeParams", "$http", "sketchSvc", "$timeout", "authService",
    function ($scope, $routeParams, $http, sketchSvc, $timeout, authService) {
      $scope.getPreview = function () {
      	$scope.previewCompiling = true;
	      $scope.previewError = false;
        $("#previewPanel").addClass("open");
        $("#previewIframe").removeAttr("src");

        $http.post(beURL + "/sketches/preview", {
            code: editor.getValue()
          })
          .then(function (previewResponse) {
	          $scope.previewCompiling = false;
	          $("#previewIframe")[0].contentDocument.open();//Reboot, if not it will append code
            $("#previewIframe")[0].contentDocument.write(previewResponse.data.code);
            takeScreenshots();
          }).catch((e) => {
	          $("#previewIframe")[0].contentDocument.open();//Reboot, if not it will append code
	          $scope.previewCompiling = false;
	          $('.errorLogo').transition('tada');
	          $scope.previewError = e;
		        console.log(e);
          });
      };

      let takenScreenshots = [];
      const takeScreenshots = () => {
        takenScreenshots = [];

        const preview = $("#previewIframe")[0].contentDocument;
        
        (function takeScreenshot() {
          let canvas = preview.getElementsByTagName("canvas")[0];
          if (canvas) {
            takenScreenshots.push(canvas.toDataURL('image/jpeg', 0.1))
          }

          if (takenScreenshots.length < 5) {
            $timeout(takeScreenshot, 1000);
          }
        })();
      }

      $scope.openModal = () => {
        $scope.modal.modal("show");
      }

      $scope.canSave = () => $scope.title;

      $scope.save = () => {
        if (takenScreenshots.length) {
          $scope.thumbnails = takenScreenshots;
        }

        const sketch = {
          title: $scope.title,
          code: editor.getValue(),
          tags: $scope.tags,
          thumbnails: $scope.thumbnails,
	        is_public: !$scope.isPrivateSketch
        };

        if ($scope.sketch_id) {
          sketchSvc.update($scope.sketch_id, sketch).then((sketch) => {
            console.log(`${sketch.title} was successfully updated.`)
          });
        } else {
          sketchSvc.create(sketch).then((sketch) => {
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

	    $(document).ready(() => {
		    authService.currentUser().then((user) => {
			    $scope.showPremiumFeatures = user.user_type === 'PREM';
		    });
	    });

	    $scope.isPrivateSketch = false;

	    $scope.sketchStateMsg = () => {
				return $scope.isPrivateSketch ? "Sketch privado" : "Sketch publico";
	    };

      const editor = ace.edit("editor");

      editor.setTheme("ace/theme/ambiance");
      editor.session.setMode("ace/mode/scala");
	    editor.setOptions({
		    fontSize: "16pt",
		    enableBasicAutocompletion: true
	    });

      const loadSketch =  () => {
  	    sketchSvc.find($routeParams.sketch_id).then(({ title, code, tags, thumbnails }) => {
  		    $scope.sketch_id = $routeParams.sketch_id;
  		    $scope.title = title;
  		    $scope.tags = tags;
          $scope.thumbnails = thumbnails;
  		    editor.setValue(code);
  	    });
      }

      const copySketch =  (id) => {
        sketchSvc.find(id).then(({ title, code }) => {
          $scope.title = "Copia de " + title;
          editor.setValue(code);
        });
      }

      if ($routeParams.sketch_id) {
  	    loadSketch();
      } else if ($routeParams.copied_sketch_id) {
        copySketch($routeParams.copied_sketch_id);
      } else if ($routeParams.script) {
        editor.setValue($routeParams.script);
      } else {
        let defaultScript = "Setup._2D.LeftBottom.asCanvas\r\n  \r\n  def render():Unit = {\r\n \r\n   }";
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
