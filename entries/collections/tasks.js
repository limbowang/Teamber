var Task = require('../models/task');

var Tasks = Backbone.Collection.extend({
  model: Task,
  url: 'tasks',
  taskboardid: 0,
  ptaskid: -1,
  sync: function(method, model, options) {
    options.wait = true;
    if (!options.url) {
      if (method == "read") {
        if (this.ptaskid < 0) {
          options.url = '/taskboards/' + this.taskboardid + '/tasks';
        } else {
          options.url = '/tasks/' + this.ptaskid + '/subtasks';
        }
      }
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Tasks;