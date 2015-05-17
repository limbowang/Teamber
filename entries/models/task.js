var Task = Backbone.Model.extend({
  defaults: {
  },
  url: '/tasks',
  sync: function(method, model, options) {
    console.log(method);
    options.wait = true;
    if (method == 'create') {
      options.url = '/tasks/create';
    } else if (method == 'update') {
      options.url = '/tasks/' + this.get('id') + '/update';
    } else if (method == 'delete') {
      options.url = '/tasks/' + this.get('id') + '/destroy';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Task;