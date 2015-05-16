var Team = Backbone.Model.extend({
  defaults: {
  },
  url: '/teams',
  sync: function(method, model, options) {
    console.log(method);
    options.wait = true;
    if (method == 'create') {
      options.url = '/teams/create';
    } else if (method == 'update') {
      options.url = '/teams/' + this.get('id') + '/update';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Team;