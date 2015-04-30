define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone, tplTeamAdd){
  var HeaderView = Backbone.View.extend({
    el: $('#header'),
    events: {
      'click #signout': 'signout'
    },
    initialize: function() {
      this.formSignout = $('#form-signout');
      this.dropdownMenu = this.$el.find('.dropdown-menu');
    },
    signout: function() {
      this.formSignout.submit();
    }
  });
  // Our module now returns our view
  return HeaderView;
});