var Scrollable = function(selector, options) {
	this.$parent = selector? $(selector) : $('.scrollable');
	this.$el = this.$el.find('.scroll');
	if (this.$el.size() > 0) {
		this.$el.on('scroll', this.scroll);
		this.times = options.times || 5;
		this.index = 0;
	}
}

Scrollable.prototype.scroll = function(e) {
	
		this.delta = 0;
		this.heightParent = 0;
		this.heightChild = 0;
		this.step = 0;
	if (this.index > 0 && this.index < this.times) {

	}
}

(function(factory) {
	// amd
	if (typeof require === 'function' 
		&& typeof module === 'object' 
		&& typeof exports === 'object') {
		factory(exports);
	} else if (typeof define === 'function') {
		define(factory);
	} else {
		factory(window)
	}
}(function(exports) {
	exports = Scrollable;
}))