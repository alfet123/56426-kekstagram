/* global Photo: true */
/* global Gallery: true */

'use strict';

require('photo');
require('gallery');

(function() {

  var container = document.querySelector('.pictures');
  var filtersBlock = document.querySelector('.filters');
  var filters = document.querySelector('.filters');
  var IMAGE_TIMEOUT = 10000;
  var MILLISECONDS_IN_DAY = 86400000;
  var PAGE_SIZE = 12;
  var activeFilter = 'filter-popular';
  var currentPage = 0;
  var scrollTimeout;
  var pictures = [];
  var filteredPictures = [];
  var renderedElements = [];
  var viewportSize = window.innerHeight;
  var gallery = new Gallery();

  var currentDate = new Date();
  var currentDays = Math.floor(currentDate.getTime() / MILLISECONDS_IN_DAY);

  filtersBlock.classList.add('hidden');

  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('filters-radio')) {
      setActiveFilter(clickedElement.id);
    }
  });

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (testCoordinates()) {
        renderPictures(filteredPictures, ++currentPage, false);
      }
    }, 100);
  });

  getPictures();

  function testCoordinates() {
    var picturesCoordinates = container.getBoundingClientRect();
    return ((picturesCoordinates.bottom <= viewportSize) && (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)));
  }

  /**
   * Вывод изображений
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

    renderedElements = renderedElements.concat(pagePictures.map(function(picture, index) {
      var pictureElement = new Photo(picture);
      pictureElement.render();
      fragment.appendChild(pictureElement.element);

      pictureElement.onClick = function() {
        gallery.setPictures(filteredPictures);
        gallery.setCurrentPicture(index + from);
        gallery.show();
      };

      return pictureElement;
    }));

    container.appendChild(fragment);
  }

  /**
   * Установка выбранного фильтра
   */
  function setActiveFilter(id) {
    if (activeFilter === id) {
      return;
    }

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

      renderPictures(filteredPictures, 0, true);
      while (testCoordinates()) {
        renderPictures(filteredPictures, ++currentPage, false);
      }
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
   * Сообщение об ошибке
   */
  function failureMessage() {
    container.classList.add('pictures-failure');
  }

  filtersBlock.classList.remove('hidden');

})();
