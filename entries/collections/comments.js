var Comment = require('../models/comment');

var Comments = Backbone.Collection.extend({
  model: Comment,
  url: 'comments',
  taskid: 0,
  sync: function(method, model, options) {
    options.wait = true;
    if (method == "read") {
      options.url = '/tasks/' + this.taskid + '/comments';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Comments;