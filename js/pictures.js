/* global pictures: true */

'use strict';

(function() {

  var filtersBlock = document.querySelector('.filters');
  filtersBlock.classList.add('hidden');

  var container = document.querySelector('.pictures');

  pictures.forEach(function(picture) {
    var element = getElementFromTemplate(picture);
    container.appendChild(element);
  });

  function getElementFromTemplate(data) {
    var template = document.querySelector('#picture-template');
    var element;
    var IMAGE_TIMEOUT = 10000;

    if ('content' in template) {
      element = template.content.children[0].cloneNode(true);
    } else {
      element = template.children[0].cloneNode(true);
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

  filtersBlock.classList.remove('hidden');

})();
