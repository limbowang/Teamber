var Task = Backbone.Model.extend({
  defaults: {
  },
  url: '/tasks',
  sync: function(method, model, options) {
    options.wait = true;
    if (method == 'create') {
      options.url = '/tasks/create';
    } else if(method == 'read') {
      options.url = '/tasks/' + this.get('id');
    } else if (method == 'update') {
      options.url = '/tasks/' + this.get('id') + '/update';
    } else if (method == 'delete') {
      options.url = '/tasks/' + this.get('id') + '/destroy';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Task;