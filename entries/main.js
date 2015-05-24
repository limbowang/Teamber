global.$ = global.jQuery = require('jquery');
global.Backbone = require('backbone');
global.Backbone.$ = global.$;
global.hbs = require('Handlebars');
global._ = require('underscore');
require('../bower_components/bootflat/js/bootstrap');
require('../bower_components/bootflat/js/html5shiv');
require('../bower_components/bootstrap-datepicker/js/bootstrap-datepicker');
require('../bower_components//bootstrap-calendar/js/calendar');

// emulate http with post
Backbone.emulateHTTP = true;

var app = require('./app');

app.init();