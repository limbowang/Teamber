var Member = require('../models/member');

var Members = Backbone.Collection.extend({
  model: Member,
  url: '/members',
  sync: function(method, model, options) {
    // options.wait = true;
  	console.log(method);
    if (method == "read") {
  		options.url = '/teams/' + options.teamid + '/members';
  	}
  	return Backbone.sync(method, model, options);
  }
});

module.exports = Members;