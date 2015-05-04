define(['backbone', 'models/team'], function(Backbone, Team) {
  return Backbone.Collection.extend({
    model: Team,
    url: '/teams',
    wait: true
  });
});