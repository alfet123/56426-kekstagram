'use strict';

(function() {

  /**
   * Конструктор для галереи
   * @constructor
   */
  var Gallery = function() {

    this.element = document.querySelector('.gallery-overlay');
    this._image = document.querySelector('.gallery-overlay-image');
    this._closeButton = document.querySelector('.gallery-overlay-close');

    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);

  };

  Gallery.prototype = {

    /**
     * Отображение галереи
     */
    show: function() {
      this.element.classList.remove('invisible');
      this._image.addEventListener('click', this._onPhotoClick);
      this._closeButton.addEventListener('click', this._onCloseClick);
      window.addEventListener('keydown', this._onKeyDown);
    },

    /**
     * Скрытие галереи
     */
    hide: function() {
      this.element.classList.add('invisible');
      this._image.removeEventListener('click', this._onPhotoClick);
      this._closeButton.removeEventListener('click', this._onCloseClick);
      window.removeEventListener('keydown', this._onKeyDown);
    },

    /**
     * Инициализация изображений для галереи
     * @param {Array.<Object>} data
     */
    setPictures: function(data) {
      this._data = data;
    },

    /**
     * Установка текущего изображения галереи
     * @param {number|string} picture
     */
    setCurrentPicture: function(picture) {
      switch (typeof picture) {
        case 'number':
          this._number = picture;
          this.element.querySelector('.gallery-overlay-image').src = this._data[picture].url;
          this.element.querySelector('.likes-count').textContent = this._data[picture].likes;
          this.element.querySelector('.comments-count').textContent = this._data[picture].comments;
          break;
        case 'string':
          break;
        default:
      }
    },

    /**
     * Обработчик клика по фотографии
     */
    _onPhotoClick: function() {
      if (this._data[this._number + 1]) {
        this.setCurrentPicture(++this._number);
      }
    },

    /**
     * Обработчик клика по кнопке закрытия
     */
    _onCloseClick: function() {
      location.hash = '';
    },

    /**
     * Обработчик нажатия клавиши
     * @param {Event} evt
     */
    _onKeyDown: function(evt) {
      switch (evt.keyCode) {
        case 27:
          location.hash = '';
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
