var require = requirejs;

requirejs.config({
	baseUrl: '../dist/js'
	paths: {
		'jquery': 'jquery-1.10.1.min',
		'bootstrap': 'bootstrap.min'
		'backbone': 'backbone',
		'underscore': 'underscore-min'
	},
	shim: {
		'underscore': {
			exports: '_'
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

