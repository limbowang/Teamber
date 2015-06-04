var Tasks = require('../collections/tasks');
var TaskView = require('./task');
var tplMytasks = require('../templates/board/mytasks/board.handlebars');
var tplTaskItem = require('../templates/board/mytasks/taskitem.handlebars');

var TaskItemView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    var task = this.model;
    var html = tplTaskItem(this.model.toJSON());
    this.$el.html(html);
    this.$el.find('a').on('click', function() {
      var view = new TaskView({model: task});
      view.render();
    });
    return this;
  }
});

var MyTaskView = Backbone.View.extend({
  el: '#board',
  events: {
    'click .tab': 'switchTab'
  },
  initialize: function() {
    this.tasks = new Tasks();
    this.tasks.on('reset', this.renderList, this);
    this.tasks.on('add', this.renderItem, this);
  },
  render: function() {
    var html = tplMytasks();
    this.$el.html(html);
    this.tasks.fetch({
      wait: true,
      url: '/users/own/tasks',
      data: {
        type: $('.tab.active').data('index')
      },
      reset: true
    });
  },
  renderList: function() {
    this.$el.find('.panel.active .task-list').html('');
    this.tasks.each(this.renderItem, this);
  },
  renderItem: function(task) {
    var view = new TaskItemView({model: task});
    var $activePanel = this.$el.find('.panel.active');
    $activePanel.find('.task-list').append(view.render().el);
    task.on('destroy', function() {
      view.remove();
    })
  },
  switchTab: function(e) {
    var $cur = $(e.currentTarget);
    if (!$cur.hasClass('active')) {
      this.tasks.fetch({
        wait: true,
        url: '/users/own/tasks',
        data: {
          type: $cur.data('index')
        },
        reset: true
      });
    }
  }
});

module.exports = MyTaskView;