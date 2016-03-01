'use strict';

(function() {

  /**
   * Пустой конструктор
   * @constructor
   */
  function EmptyCtor() {}

  /**
   * @param {Object} child
   * @param {Object} parent
   */
  function inherit(child, parent) {
    EmptyCtor.prototype = parent.prototype;
    child.prototype = new EmptyCtor();
  }

  window.inherit = inherit;

})();
