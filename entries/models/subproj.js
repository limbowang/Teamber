var Subproj = Backbone.Model.extend({
  defaults: {
  },
  url: '/subprojects',
  sync: function(method, model, options) {
    console.log(method);
    options.wait = true;
    if (method == 'create') {
      options.url = '/subprojects/create';
    } else if (method == 'update') {
      options.url = '/subprojects/' + this.get('id') + '/update';
    } else if (method == 'delete') {
      options.url = '/subprojects/' + this.get('id') + '/destroy';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Subproj;