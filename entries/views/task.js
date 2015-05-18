var tplTaskView = require('../templates/board/task/taskview.handlebars');
var TaskView = Backbone.View.extend({
  el: '#modal',
  events: {
    'click .tab': 'switchTab'
  },
  initialize: function() {

  },
  render: function() {
    var self = this;
    this.model.fetch({
      success: function(task) {
        var html = tplTaskView(self.model.toJSON());
        self.$el.html(html).show();
      }
    });
  },
  switchTab: function(e) {
    var $cur = $(e.currentTarget);
    var index = $cur.data('index');
    this.$el.find('.tab.active').removeClass('active');
    this.$el.find('.tab-pane.active').removeClass('active');
    $cur.addClass('active');
    this.$el.find('.tab-pane[data-index=' + index + ']').addClass('active');
  }
});

module.exports = TaskView;