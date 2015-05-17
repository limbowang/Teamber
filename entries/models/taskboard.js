var Taskboard = Backbone.Model.extend({
  defaults: {
  },
  url: '/taskboards',
  sync: function(method, model, options) {
    console.log(method);
    options.wait = true;
    if (method == 'create') {
      options.url = '/taskboards/create';
    } else if (method == 'update') {
      options.url = '/taskboards/' + this.get('id') + '/update';
    } else if (method == 'delete') {
      options.url = '/taskboards/' + this.get('id') + '/destroy';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Taskboard;