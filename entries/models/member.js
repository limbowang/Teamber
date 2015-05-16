var Member = Backbone.Model.extend({
  defaults: {
  },
  idAttribute: "email",
  url: '/members',
  sync: function(method, model, options) {
    options.wait = true;
    console.log(method);
    if (method == 'delete') {
      options.data = { email: this.get('email')};
      options.processData = true;
      options.url = '/teams/' + this.get('team_id') + '/members/remove';
    }
    return Backbone.sync(method, model, options);
  }
});

module.exports = Member;