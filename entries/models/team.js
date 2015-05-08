define(['backbone'], function(Backbone) {
  return Backbone.Model.extend({
    defaults: {
      id: 0,
      name: ''
    },
    url: 'teams'
  });
});