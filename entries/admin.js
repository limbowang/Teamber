global.$ = global.jQuery = require('jquery');
global.Backbone = require('backbone');
global.Backbone.$ = global.$;
global.hbs = require('Handlebars');
require('../bower_components/bootflat/js/bootstrap');
require('../bower_components/bootflat/js/html5shiv');

var HeaderView = require('./views/header');
var AdminView = require('./views/admin');

function init() {
	new HeaderView();
	new AdminView();
}

init();