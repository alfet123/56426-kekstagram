'use strict';

(function() {

  var Photo = function(data) {

    this._data = data;

  };

  Photo.prototype = {

    render: function() {
      var template = document.querySelector('#picture-template');

      if ('content' in template) {
        this.element = template.content.childNodes[1].cloneNode(true);
      } else {
        this.element = template.childNodes[1].cloneNode(true);
      }

      var newImage = new Image(182, 182);

      var IMAGE_TIMEOUT = 10000;
      var imageLoadTimeout = setTimeout(function() {
        newImage.src = '';
        this.element.classList.add('picture-load-failure');
      }.bind(this), IMAGE_TIMEOUT);

      newImage.onload = function() {
        clearTimeout(imageLoadTimeout);
        this.element.replaceChild(newImage, this.element.querySelector('img'));
      }.bind(this);

      newImage.onerror = function() {
        this.element.classList.add('picture-load-failure');
      }.bind(this);

      newImage.src = this._data.url;

      this.element.querySelector('.picture-comments').textContent = this._data.comments;
      this.element.querySelector('.picture-likes').textContent = this._data.likes;
    }

  };

  window.Photo = Photo;

})();
