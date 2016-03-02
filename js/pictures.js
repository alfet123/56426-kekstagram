/* global Photo: true */
/* global Gallery: true */

'use strict';

require('photo');
require('gallery');

(function() {

  /**
   * @type {HTMLElement}
   */
  var container = document.querySelector('.pictures');

  /**
   * @type {HTMLElement}
   */
  var filters = document.querySelector('.filters');

  /**
   * Таймаут загрузки изображения
   * @const
   * @type {number}
   */
  var IMAGE_TIMEOUT = 10000;

  /**
   * Количество миллисекунд в сутках
   * @const
   * @type {number}
   */
  var MILLISECONDS_IN_DAY = 86400000;

  /**
   * Количество фотографий на странице
   * @const
   * @type {number}
   */
  var PAGE_SIZE = 12;

  var activeFilter = localStorage.getItem('activeFilter') || 'filter-popular';
  var currentPage = 0;
  var scrollTimeout;
  var pictures = [];
  var filteredPictures = [];
  var renderedElements = [];
  var viewportSize = window.innerHeight;

  /**
   * Создание новой галереи
   * @type {Gallery}
   */
  var gallery = new Gallery();

  var currentDate = new Date();
  var currentDays = Math.floor(currentDate.getTime() / MILLISECONDS_IN_DAY);

  filters.classList.add('hidden');

  /**
   * Обработчик клика по фильтру
   * @param {Event} evt
   */
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('filters-radio')) {
      setActiveFilter(clickedElement.id);
    }
  });

  /**
   * Обработчик прокрутки страницы
   */
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (testCoordinates()) {
        renderPictures(filteredPictures, ++currentPage, false);
      }
    }, 100);
  });

  /**
   * Обработчик изменения адресной строки
   */
  window.addEventListener('hashchange', function() {
    switch (location.hash.length > 0) {
      case true:
        gallery.setPictures(filteredPictures);
        gallery.setCurrentPicture(location.hash);
        gallery.show();
        break;
      case false:
        gallery.hide();
        break;
      default:
    }
  });

  /**
   * Обработчик загрузки страницы
   */
  window.addEventListener('load', function() {
    if (location.hash.length > 0) {
      gallery.setPictures(filteredPictures);
      gallery.setCurrentPicture(location.hash);
      gallery.show();
    }
  });

  getPictures();

  /**
   * Проверка достижения нижнего края страницы
   * @return {boolean}
   */
  function testCoordinates() {
    var picturesCoordinates = container.getBoundingClientRect();
    return ((picturesCoordinates.bottom <= viewportSize) && (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)));
  }

  /**
   * Вывод изображений
   * @param {Array.<Object>} picturesToRender
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
  function renderPictures(picturesToRender, pageNumber, replace) {
    if (replace) {
      var el;
      while ((el = renderedElements.shift())) {
        container.removeChild(el.element);
        el.onClick = null;
        el.remove();
      }
    }

    var fragment = document.createDocumentFragment();

    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pagePictures = picturesToRender.slice(from, to);

    renderedElements = renderedElements.concat(pagePictures.map(function(picture) {
      var pictureElement = new Photo(picture);
      pictureElement.render();
      fragment.appendChild(pictureElement.element);

      pictureElement.onClick = function() {
        location.hash = '#img/' + this._data.url;
      };

      return pictureElement;
    }));

    container.appendChild(fragment);
  }

  /**
   * Установка выбранного фильтра
   * @param {string} id
   */
  function setActiveFilter(id) {
    currentPage = 0;
    activeFilter = id;
    filteredPictures = pictures.slice(0);

    switch (id) {
      case 'filter-new':
        filteredPictures = filteredPictures.filter(function(a) {
          var imageDate = new Date(a.date);
          var imageDays = Math.floor(imageDate.getTime() / MILLISECONDS_IN_DAY);
          return ((currentDays - imageDays) <= 14);
        });
        filteredPictures = filteredPictures.sort(function(a, b) {
          var dateA = new Date(a.date);
          var dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }

    renderPictures(filteredPictures, 0, true);
    while (testCoordinates()) {
      renderPictures(filteredPictures, ++currentPage, false);
    }

    localStorage.setItem('activeFilter', id);
  }

  /**
   * Загрузка списка изображений
   */
  function getPictures() {
    container.classList.add('pictures-loading');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://o0.github.io/assets/json/pictures.json');
    xhr.timeout = IMAGE_TIMEOUT;

    xhr.onload = function(evt) {
      container.classList.remove('pictures-loading');

      var rawData = evt.target.response;
      var loadedPictures = JSON.parse(rawData);
      pictures = loadedPictures;
      filteredPictures = pictures.slice(0);

      setActiveFilter(activeFilter);
      document.getElementById(activeFilter).checked = true;
    };

    xhr.onerror = function() {
      failureMessage();
    };

    xhr.ontimeout = function() {
      failureMessage();
    };

    xhr.send();
  }

  /**
   * Вывод сообщения об ошибке
   */
  function failureMessage() {
    container.classList.add('pictures-failure');
  }

  filters.classList.remove('hidden');

})();
