require.config({
  paths: {
    'jquery': '/dist/js/jquery-1.10.1.min',
    'bootstrap': '/dist/js/bootstrap',
    'backbone': '/dist/js/backbone',
    'underscore': '/dist/js/underscore-min',
    'hbs': '/dist/js/handlebars'
    'text': '/dist/js/text'
  },
  shim: {
    'underscore': {
      exports: '_'
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'jquery.selecter': {
      deps: ['jquery'],
      exports: 'jquery.fn.selecter'
    },
    'jquery.stepper': {
      deps: ['jquery'],
      exports: 'jquery.fn.stepper'
    }
  }
});


require([
  'jquery',
  'bootstrap',
  'app'
  ], function($, boostrap, app) {
  app.init();
});
