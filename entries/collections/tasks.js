var Task = require('../models/task');

var Tasks = Backbone.Collection.extend({
  model: Task,
  url: 'tasks',
  taskboardid: 0,
  sync: function(method, model, options) {
    options.wait = true;
    if (method == "read") {
      options.url = '/taskboards/' + this.taskboardid + '/tasks';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Tasks;