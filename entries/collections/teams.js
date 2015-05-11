var Team = require('../models/team');

var Teams = Backbone.Collection.extend({
  model: Team,
  url: '/teams'
});

module.exports = Teams;