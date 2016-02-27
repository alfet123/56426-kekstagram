'use strict';

(function() {

  var Gallery = function() {

    this.element = document.querySelector('.gallery-overlay');
    this._image = document.querySelector('.gallery-overlay-image');
    this._closeButton = document.querySelector('.gallery-overlay-close');

    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);

  };

  Gallery.prototype = {

    show: function() {
      this.element.classList.remove('invisible');
      this._image.addEventListener('click', this._onPhotoClick);
      this._closeButton.addEventListener('click', this._onCloseClick);
      window.addEventListener('keydown', this._onKeyDown);
    },

    hide: function() {
      this.element.classList.add('invisible');
      this._image.removeEventListener('click', this._onPhotoClick);
      this._closeButton.removeEventListener('click', this._onCloseClick);
      window.removeEventListener('keydown', this._onKeyDown);
    },

    setPictures: function(data) {
      this._data = data;
    },

    setCurrentPicture: function(number) {
      this._number = number;
      this.element.querySelector('.gallery-overlay-image').src = this._data[number].url;
      this.element.querySelector('.likes-count').textContent = this._data[number].likes;
      this.element.querySelector('.comments-count').textContent = this._data[number].comments;
    },

    _onPhotoClick: function() {
      if (this._data[this._number + 1]) {
        this.setCurrentPicture(++this._number);
      }
    },

    _onCloseClick: function() {
      this.hide();
    },

    _onKeyDown: function(evt) {
      switch (evt.keyCode) {
        case 27:
          this.hide();
          break;
        case 37:
          if (this._data[this._number - 1]) {
            this.setCurrentPicture(--this._number);
          }
          break;
        case 39:
          if (this._data[this._number + 1]) {
            this.setCurrentPicture(++this._number);
          }
          break;
        default:
      }
    }

  };

  window.Gallery = Gallery;

})();
