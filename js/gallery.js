'use strict';

(function() {

  var Gallery = function() {

    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = document.querySelector('.gallery-overlay-close');

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);

  };

  Gallery.prototype = {

    show: function() {
      this.element.classList.remove('invisible');
      this._closeButton.addEventListener('click', this._onCloseClick);
      window.addEventListener('keydown', this._onKeyDown);
    },

    hide: function() {
      this.element.classList.add('invisible');
      this._closeButton.removeEventListener('click', this._onCloseClick);
      window.removeEventListener('keydown', this._onKeyDown);
    },

    _onPhotoClick: function() {

    },

    _onCloseClick: function() {
      this.hide();
    },

    _onKeyDown: function(evt) {
      if (evt.keyCode === 27) {
        this.hide();
      }
    }

  };

  window.Gallery = Gallery;

})();
