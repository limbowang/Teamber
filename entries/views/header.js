var HeaderView = Backbone.View.extend({
  el: '#header',
  events: {
    'click #signout': 'signout'
  },
  initialize: function() {
    this.formSignout = $('#form-signout');
  },
  signout: function() {
    this.formSignout.submit();
  }
});

// Our module now returns our view
module.exports = HeaderView;