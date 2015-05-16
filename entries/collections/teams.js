var Team = require('../models/team');

var Teams = Backbone.Collection.extend({
  model: Team,
  url: '/teams',
  sync: function(method, model, options) {
    options.wait = true;
    if (method == 'create') {
      options.url = '/teams/create';
    } else if (method == 'update') {
      options.url = '/teams/' + this.get('id') + '/update';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Teams;