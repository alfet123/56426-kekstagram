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
          var _url = picture.match( /#img\/(\S+)/ )[1];
          var result = this._data.filter(function(item) {
            return item.url === _url;
          });
          this.element.querySelector('.gallery-overlay-image').src = result[0].url;
          this.element.querySelector('.likes-count').textContent = result[0].likes;
          this.element.querySelector('.comments-count').textContent = result[0].comments;
          break;
        default:
      }
    },

    /**
     * Обработчик клика по фотографии
     */
    _onPhotoClick: function() {
      var index = this.getIndex();
      if (this._data[index + 1]) {
        location.hash = '#img/' + this._data[index + 1].url;
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
      var index;
      switch (evt.keyCode) {
        case 27:
          location.hash = '';
          break;
        case 37:
          index = this.getIndex();
          if (this._data[index - 1]) {
            location.hash = '#img/' + this._data[index - 1].url;
          }
          break;
        case 39:
          index = this.getIndex();
          if (this._data[index + 1]) {
            location.hash = '#img/' + this._data[index + 1].url;
          }
          break;
        default:
      }
    },

    /**
     * Получение индекса текущего изображения галереи
     * @return {number}
     */
    getIndex: function() {
      var url = location.hash.match( /#img\/(\S+)/ )[1];
      var index = 0;
      while ((this._data[index].url !== url) && index < this._data.length) {
        index++;
      }
      return index;
    }

  };

  window.Gallery = Gallery;

})();
