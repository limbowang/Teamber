var Contributor = require('../models/contributor');

var Contributors = Backbone.Collection.extend({
  model: Contributor,
  url: '/contributors',
  sync: function(method, model, options) {
    options.wait = true;
  	console.log(method);
    if (method == "read") {
  		options.url = '/projects/' + options.projid + '/contributors';
  	}
  	return Backbone.sync(method, model, options);
  }
});

module.exports = Contributors;