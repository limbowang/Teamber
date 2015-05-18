var Checkitem = require('../models/checkitem');

var Checkitems = Backbone.Collection.extend({
  model: Checkitem,
  url: 'checkitems',
  taskid: 0,
  sync: function(method, model, options) {
    options.wait = true;
    if (method == "read") {
      options.url = '/tasks/' + this.taskid + '/checkitems';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Checkitems;