var Proj = require('../models/proj');

var Projs = Backbone.Collection.extend({
  model: Proj
});

module.exports = Projs;