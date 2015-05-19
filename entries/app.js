global.BaseView = require('./views/base');
global.alert = require('./helpers/alert');

var router = require('./router');

var init = function() {
  router.init();
}

module.exports = {
  init: init
};