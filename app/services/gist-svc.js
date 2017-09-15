'use strict';

angular.module('myApp.gistSvc', []).service("gistSvc", function () {

  function getShareLinkFor(sketch) {
    return readSketch(sketch)
      .then(determineIfshouldCreateNewGist)
      .then(createGist)
      .then(storeGistAndReturnLink)
      .catch(reuseGistIfCodeDidntChange);
  }

  function reuseGistIfCodeDidntChange(whatHappened) {
    if (whatHappened == "Sketch hasn't changed, show the old saved gist")
      return `https://gist.github.com/${localStorage.getItem(sketch)}`;
    else
      throw "There was an error! but here's your link: WHAT IS THAT BEHIND YOU?! *runs away*";
  }

  function storeGistAndReturnLink(gist) {
    localStorage.setItem(sketch, gist.id);

    return gist.html_url;
  }

  function readSketch(sketch) {
    return Promise.resolve({
      name: sketch.title,
      code: sketch.code
    });
  }

  function determineIfshouldCreateNewGist(sketch) {
    return new Promise(function (createNewGist, shouldntCreateGist) {

      var gistId = localStorage.getItem(sketch.name);

      if (!gistId) {
        createNewGist(sketch);
      }
      else {
        $.get(`https://api.github.com/gists/${gistId}`).then(function (gist) {
          var sketchGistData = gist.files["sketch.scala"];

          var getGistContents = new Promise(function (gotContents) {
            if (sketchGistData.truncated)
              $.get(sketchGistData.raw_url).then(gotContents);
            else
              gotContents(sketchGistData.content);
          });

          getGistContents.then(function (gistContents) {
            if (areSameContents(sketch.code, gistContents))
              shouldntCreateGist("Sketch hasn't changed, show the old saved gist");
            else
              createNewGist(sketch);
          });
        });
      }
    });
  }

  function createGist(sketch) {
    return $.ajax({
      url: 'https://api.github.com/gists',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({
        "description": sketch.name,
        "public": true,
        "files": {
          "sketch.scala": {
            "content": sketch.code
          }
        }
      })
    });
  }

  function areSameContents(str1, str2) {
    return str1.replace(/\s/g, "") == str2.replace(/\s/g, "");
  }

  return {getShareLinkFor: getShareLinkFor};
});