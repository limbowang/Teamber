var Contributor = Backbone.Model.extend({
  defaults: {
  },
  idAttribute: "email",
  url: '/contributors',
  sync: function(method, model, options) {
    options.wait = true;
    console.log(method);
    if (method == 'create') {
      options.url = '/projects/' + this.get('proj_id') + '/contributors/add';
    } else if (method == 'delete') {
      options.data = { email: this.get('email')};
      options.processData = true;
      options.url = '/projects/' + this.get('proj_id') + '/contributors/remove';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Contributor;