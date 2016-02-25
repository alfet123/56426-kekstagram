'use strict';

(function() {

  function EmptyCtor() {}

  function inherit(child, parent) {
    EmptyCtor.prototype = parent.prototype;
    child.prototype = new EmptyCtor();
  }

  window.inherit = inherit;

})();
