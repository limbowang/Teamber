var Proj = Backbone.Model.extend({
  defaults: {
  },
  url: '/projects',
  sync: function(method, model, options) {
    console.log(method);
    options.wait = true;
    if (method == 'create') {
      options.url = '/projects/create';
    } else if (method == 'update') {
      options.url = '/projects/' + this.get('id') + '/update';
    } else if (method == 'delete') {
      options.url = '/projects/' + this.get('id') + '/destroy';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Proj;