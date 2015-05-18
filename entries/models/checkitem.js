var Checkitem = Backbone.Model.extend({
  defaults: {
  },
  url: '/checkitems',
  sync: function(method, model, options) {
    console.log(method);
    options.wait = true;
    if (method == 'create') {
      options.url = '/checkitems/create';
    } else if (method == 'update') {
      options.url = '/checkitems/' + this.get('id') + '/update';
    } else if (method == 'delete') {
      options.url = '/checkitems/' + this.get('id') + '/destroy';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Checkitem;