var Team = Backbone.Model.extend({
  defaults: {
  	id: 0,
    name: ''
  },
  urlRoot: '/teams'
});

module.exports = Team;