var Proj = Backbone.Model.extend({
  defaults: {
  },
  sync: function(method, model, options) {
  	return Backbone.sync(method, model, options);
  }
});

module.exports = Proj;