var History = require('../models/history');

var Histories = Backbone.Collection.extend({
  model: History,
  url: 'histories',
  taskid: 0,
  sync: function(method, model, options) {
    options.wait = true;
    if (method == "read") {
      options.url = '/tasks/' + this.taskid + '/histories';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Histories;