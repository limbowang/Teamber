var History = Backbone.Model.extend({
  defaults: {
  },
  url: '/historys',
  sync: function(method, model, options) {
    console.log(method);
    options.wait = true;
    if (method == 'create') {
      options.url = '/historys/create';
    } else if (method == 'update') {
      options.url = '/historys/' + this.get('id') + '/update';
    } else if (method == 'delete') {
      options.url = '/historys/' + this.get('id') + '/destroy';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = History;