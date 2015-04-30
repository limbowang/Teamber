define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/proj/list.html'
], function($, _, Backbone, tpl){
  var ProjListView = Backbone.View.extend({
    el: $('#sidebar'),
    initialize: function() {
      this.render();
    },
    render: function() {
      var data = {
        projs: [{
          name: "123",
          subprojs: ["123", "123"]
        },{
          name: "234",
          subprojs: ["234"]
        }]
      };
      var html = _.template(tpl)(data);
      this.$el.append( html );
    }
  });
  return ProjListView;
});