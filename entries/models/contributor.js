var Contributor = Backbone.Model.extend({
  defaults: {
  },
  idAttribute: "email",
  url: '/contributors',
  sync: function(method, model, options) {
    options.wait = true;
    console.log(method);
    return Backbone.sync(method, model, options);
  }
});

module.exports = Contributor;