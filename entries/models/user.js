var User = Backbone.Model.extend({
  defaults: {
  },
  idAttribute: "username",
  url: '/users',
  sync: function(method, model, options) {
    options.wait = true;
    console.log(method);
    if (method == 'update') {
      options.url = '/users/' + this.get('username') + '/update';
    } else if (method == 'delete') {
      options.url = '/users/' + this.get('username') + '/destroy';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = User;