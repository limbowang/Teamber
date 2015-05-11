var BaseView = Backbone.View.extend({
	el: '#main',
	constructor: function() {
		var self = this;

		this.$sidebar = $('#sidebar');
		this.$modal = $('#modal');
		this.$content = $('content');

		this.$modal.on('click', '[data-dismiss="modal"]', function(){ 
			self.$modal.hide();
		});

		Backbone.View.apply(this, arguments);
	}
})

module.exports = BaseView;