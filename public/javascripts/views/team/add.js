define([
  'jquery',
  'underscore',
  'backbone',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!templates/team/add.html'
], function($, _, Backbone, tplTeamAdd){
  var TeamAddView = Backbone.View.extend({
    el: $('#main'),
    initialize: function() {
    },
    showAddModal: function() {
      var data = {};
      var html = _.template(tplTeamAdd);
      // Append our compiled template to this Views "el"
      this.$el.append( html );
      this.$el.find('.modal').show(); 
    }
  });
  // Our module now returns our view
  return TeamAddView;
});