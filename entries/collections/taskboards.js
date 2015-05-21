var Taskboard = require('../models/taskboard');

var Taskboards = Backbone.Collection.extend({
  model: Taskboard,
  url: 'taskboards',
  projid: 0,
  subprojid: 0,
  sync: function(method, model, options) {
    options.wait = true;
    if (method == "read") {
      options.url = '/subprojects/' + this.subprojid + '/taskboards';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Taskboards;