'use strict';

describe('myApp.gallery module', function() {

  beforeEach(module('myApp.gallery'));

  describe('gallery controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var galleryCtrl = $controller('GalleryCtrl');
      expect(galleryCtrl).toBeDefined();
    }));

  });
});