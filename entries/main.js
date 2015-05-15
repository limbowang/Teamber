global.$ = global.jQuery = require('jquery');
global.Backbone = require('backbone');
global.Backbone.$ = global.$;
global.hbs = require('Handlebars');
require('../bower_components/bootflat/js/bootstrap');
require('../bower_components/bootflat/js/html5shiv');

// emulate http with post
Backbone.emulateHTTP = true;

var app = require('./app');

app.init();