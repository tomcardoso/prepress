import { message } from 'partials/init';

export default (function() {

  'use strict';

  var prepressGraphic = (function() {

    function initializer() {
      console.log(message());
    }

    return {
      init: initializer
    };

  })();

  prepressGraphic.init();

})();
