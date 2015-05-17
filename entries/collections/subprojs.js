var Subproj = require('../models/subproj');

var Subprojs = Backbone.Collection.extend({
  model: Subproj,
  url: '/subprojects',
  projid: 0,
  sync: function(method, model, options) {
    options.wait = true;
    if (method == "read") {
      options.url = '/projects/' + this.projid + '/subprojects';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Subprojs;