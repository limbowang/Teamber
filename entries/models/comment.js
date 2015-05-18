var Comment = Backbone.Model.extend({
  defaults: {
  },
  url: '/comments',
  sync: function(method, model, options) {
    console.log(method);
    options.wait = true;
    if (method == 'create') {
      options.url = '/comments/create';
    } else if (method == 'update') {
      options.url = '/comments/' + this.get('id') + '/update';
    } else if (method == 'delete') {
      options.url = '/comments/' + this.get('id') + '/destroy';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Comment;