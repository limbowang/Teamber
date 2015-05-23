var Assignment = Backbone.Model.extend({
  defaults: {
  },
  idAttribute: "email",
  url: '/assignments',
  sync: function(method, model, options) {
    console.log(method);
    options.wait = true;
    options.processData = true;
    options.data = { email: this.get('email')};
    if (method == 'create' || method == 'update') {
      options.url = '/tasks/' + options.taskid + '/assign';
    } else if (method == 'delete') {
      options.url = '/tasks/' + options.taskid + '/dismiss';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Assignment;