'use strict';

(function() {

  var container = document.querySelector('.pictures');
  var filtersBlock = document.querySelector('.filters');
  var filters = document.querySelectorAll('.filters-radio');
  var IMAGE_TIMEOUT = 10000;
  var MILLISECONDS_IN_DAY = 86400000;
  var activeFilter = 'filter-popular';
  var pictures = [];

  var currentDate = new Date();
  var currentDays = Math.floor(currentDate.getTime() / MILLISECONDS_IN_DAY);

  filtersBlock.classList.add('hidden');

  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function(evt) {
      var clickedElementID = evt.target.id;
      setActiveFilter(clickedElementID);
    };
  }

  getPictures();

  /**
   * Вывод изображений
   */
  function renderPictures(picturesToRender) {
    container.innerHTML = '';
    var fragment = document.createDocumentFragment();

    picturesToRender.forEach(function(picture) {
      var element = getElementFromTemplate(picture);
      fragment.appendChild(element);
    });

    container.appendChild(fragment);
  }

  /**
   * Установка выбранного фильтра
   */
  function setActiveFilter(id) {
    if (activeFilter === id) {
      return;
    }

    activeFilter = id;

    var filteredPictures = pictures.slice(0);

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

    renderPictures(filteredPictures);
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

      renderPictures(loadedPictures);
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
   * Создание элемента на основе шаблона
   */
  function getElementFromTemplate(data) {
    var template = document.querySelector('#picture-template');
    var element;

    if ('content' in template) {
      element = template.content.childNodes[1].cloneNode(true);
    } else {
      element = template.childNodes[1].cloneNode(true);
    }

    var newImage = new Image(182, 182);

    var imageLoadTimeout = setTimeout(function() {
      newImage.src = '';
      element.classList.add('picture-load-failure');
    }, IMAGE_TIMEOUT);

    newImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      element.replaceChild(newImage, element.querySelector('img'));
      element.querySelector('img').src = newImage.src;
    };

    newImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    newImage.src = data.url;

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    return element;
  }

  /**
   * Сообщение об ошибке
   */
  function failureMessage() {
    container.classList.add('pictures-failure');
  }

  filtersBlock.classList.remove('hidden');

})();
