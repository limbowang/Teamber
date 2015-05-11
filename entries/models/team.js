var Team = Backbone.Model.extend({
  defaults: {
    name: ''
  },
  urlRoot: '/teams'
});

module.exports = Team;