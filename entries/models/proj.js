var Proj = Backbone.Model.extend({
  defaults: {
    id: 0,
    name: ''
  },
  sync: function(method, model, options) {
  	return Backbone.sync(method, model, options);
  }
});

module.exports = Proj;