define(['backbone', 'models/proj'], function(Backbone, Proj) {
  return Backbone.Collection.extend({
    model: Proj
  });
});