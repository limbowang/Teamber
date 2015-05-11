global.BaseView = require('./views/base');

var router = require('./router');

var init = function() {
  router.init();
}

module.exports = {
  init: init
};