var Assignment = require('../models/member');

var Assignments = Backbone.Collection.extend({
  model: Assignment,
  url: '/assignments',
  taskid: 0,
  sync: function(method, model, options) {
    options.wait = true;
    console.log(method);
    if (method == "read") {
      options.url = '/tasks/' + this.taskid + '/assignments';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Assignments;