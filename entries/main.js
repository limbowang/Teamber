global.$ = global.jQuery = require('jquery');
global.Backbone = require('backbone');
global.hbs = require('Handlebars');
require('../bower_components/bootflat/js/bootstrap');
require('../bower_components/bootflat/js/html5shiv');

var app = require('./app');

module.init = app.init;