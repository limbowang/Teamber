var BaseView = Backbone.View.extend({
	el: '#main',
	constructor: function(collections) {
		var self = this;

		this.$sidebar = $('#sidebar');
		this.$board = $('#board');
		this.$modal = $('#modal');
		this.$modal.on('click', '[data-dismiss="modal"]', function(){ 
			self.$modal.hide();
		});

		// init collections
		for (var key in collections) {
			this[key] = collections[key];
		}

		Backbone.View.apply(this, arguments);
	}
})

module.exports = BaseView;