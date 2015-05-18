var Assignment = Backbone.Model.extend({
  defaults: {
  },
  idAttribute: "email",
  url: '/assignments',
  sync: function(method, model, options) {
    console.log(method);
    options.wait = true;
    options.data = { email: this.get('email')};
    if (method == 'create') {
      options.url = '/tasks/' + this.get('task_id') + '/assign';
    } else if (method == 'delete') {
      options.url = '/tasks/' + this.get('task_id') + '/dismiss';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Assignment;