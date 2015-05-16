var Proj = require('../models/proj');

var Projs = Backbone.Collection.extend({
  model: Proj,
  url: 'projects',
  teamid: 0,
  sync: function(method, model, options) {
    options.wait = true;
  	if (method == "read") {
  		options.url = '/teams/' + this.teamid + '/projects';
  	}
  	return Backbone.sync(method, model, options);
  }
});

module.exports = Projs;