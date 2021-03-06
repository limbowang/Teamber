var Taskboards = require('../collections/taskboards');
var Tasks = require('../collections/tasks');
var TaskView = require('./task');
var tplTaskboardItem = require('../templates/board/proj/taskboarditem.handlebars');
var tplTaskItem = require('../templates/board/proj/taskitem.handlebars');
var tplTaskboardAdd =require('../templates/board/proj/taskboardadd.handlebars');
var tplTaskAdd =require('../templates/board/proj/taskadd.handlebars');

var TaskItemView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click .complete': 'updateComplete'
  },
  initialize: function() {
    this.model.on('change', this.render, this);
  },
  render: function() {
    console.log(4444444);
    var task = this.model;
    var html = tplTaskItem(this.model.toJSON());
    this.$el.html(html);
    this.$el.find('a').on('click', function() {
      var view = new TaskView({model: task});
      view.render();
    });
    var $cbComplete = this.$el.find('input[type="checkbox"]');
    return this;
  },
  updateComplete: function() {
    var task = this.model;
    task.save({
      isComplete: (task.get('complete_at') == null).toString()
    })
  }
});

var TaskAddView = Backbone.View.extend({
  tagName: 'li',
  className: 'task-add',
  events: {
    'click [data-action="add"]': 'renderCreate',
    'click [data-action="cancel"]': 'renderCancel',
    'click [data-action="create"]': 'createTask'
  },
  render: function() {
    var html = tplTaskAdd();
    this.$el.html(html);
    this.$btnAdd = this.$el.find('[data-action="add"]');
    this.$formTaskNew = this.$el.find('.task-new');
    return this;
  },
  renderCreate: function() {
    this.$btnAdd.addClass('hide');
    this.$formTaskNew.find('input[name="name"]').val('');
    this.$formTaskNew.removeClass('hide');
  },
  renderCancel: function() {
    this.$btnAdd.removeClass('hide');
    this.$formTaskNew.addClass('hide');
  },
  createTask: function() {
    var self = this;
    var name = this.$formTaskNew.find('input[name="name"]').val();
    this.collection.create({
      name: name,
      projid: this.collection.projid,
      taskboardid: this.collection.taskboardid
    }, {
      wait: true,
      success: function(subproj) { 
        self.renderCancel();
      },
      error: function(model, xhr, options) {
        alert('warning', xhr.responseJSON.msg);
      }
    });
  }
});

var TaskboardItemView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click .title': 'updateName',
    'click .taskboard-delete': 'deleteTaskboard'
  },
  initialize: function() {
    this.$tasklist = this.$el.find('.task-list');
    this.tasks = new Tasks();
    this.tasks.projid = this.model.projid;
    this.tasks.taskboardid = this.model.get('id');
    this.tasks.on('reset', this.renderTaskList, this);
    this.tasks.on('add', this.renderTaskItem, this);
  },
  render: function() {
    var html = tplTaskboardItem(this.model.toJSON());
    this.$el.html(html);
    // add task button
    var viewTaskAdd = new TaskAddView({collection: this.tasks});
    this.$el.find('.task-list').append(viewTaskAdd.render().el);
    this.$liAddTask = this.$el.find('.task-add');

    this.tasks.add(this.model.get('Tasks'));
    return this;
  },
  renderTaskList: function() {
    this.tasks.each(this.renderTaskItem, this);
  },
  renderTaskItem: function(task) {
    task.contributors = this.model.contributors;
    var viewTask = new TaskItemView({model: task});
    this.$liAddTask.before(viewTask.render().el);
    task.on('destroy', function() {
      viewTask.remove();
    })
  },
  updateName: function(e) {
    var self = this;
    $title = $(e.currentTarget);
    $title.attr('contenteditable', true).focus();
    $title.one('blur', function() {
      var name = $title.html();
      if (name == "") {
        $title.html(self.model.get('name'));
      } else if (name != self.model.get('name')) {
        $title.attr('contenteditable', '');
        self.model.save({
          name: name
        }, {
          wait: true,
          success: function() {}
        }) 
      }
    })
  },
  deleteTaskboard: function(e) {
    this.model.destroy({
      wait: true,
      success: function() {
        alert('success', '删除成功');
      },
      error: function() {
        alert('warning', '删除成功');
      }
    })
  }
});

var TaskboardAddView = Backbone.View.extend({
  tagName: 'li',
  className: 'taskboard-add',
  events: {
    'click [data-action="add"]': 'renderCreate',
    'click [data-action="cancel"]': 'renderCancel',
    'click [data-action="create"]': 'createTaskboard'
  },
  render: function() {
    var html = tplTaskboardAdd();
    this.$el.html(html);
    this.$btnAdd = this.$el.find('[data-action="add"]');
    this.$formTaskboardNew = this.$el.find('.taskboard-new');
    return this;
  },
  renderCreate: function() {
    this.$btnAdd.addClass('hide');
    this.$formTaskboardNew.find('input[name="name"]').val('');
    this.$formTaskboardNew.removeClass('hide');
  },
  renderCancel: function() {
    this.$btnAdd.removeClass('hide');
    this.$formTaskboardNew.addClass('hide');
  },
  createTaskboard: function() {
    var self = this;
    var name = this.$formTaskboardNew.find('input[name="name"]').val();
    this.collection.create({
      name: name,
      subprojid: this.collection.subprojid
    }, {
      wait: true,
      success: function(subproj) { 
        self.renderCancel();
      },
      error: function(model, xhr, options) {
        alert('warning', xhr.responseJSON.msg);
      }
    });
  }
})

var TaskboardsView = Backbone.View.extend({
  tagName: 'ul',
  className: 'taskboard-list',
  subprojid: 0,
  initialize: function(options) {
    this.taskboards = new Taskboards();
    this.taskboards.on('reset', this.render, this);
    this.taskboards.on('add', this.renderTaskboardItem, this);
    this.taskboards.on('reset', this.fixWidth, this);
    this.taskboards.on('add', this.fixWidth, this);
    // delegate contributots
    this.contributors = options.contributors;
  },
  render: function() {
    this.$el.html('');
    // add taskboard button
    var viewTaskboardAdd = new TaskboardAddView({collection: this.taskboards});
    this.$el.append(viewTaskboardAdd.render().el);
    this.$liTaskboardAdd = this.$el.find('.taskboard-add');

    this.taskboards.each(this.renderTaskboardItem, this);

    return this;
  },
  renderTaskboardItem: function(taskboard) {
    taskboard.projid = this.taskboards.projid;
    taskboard.contributors = this.contributors;
    var viewTaskboard = new TaskboardItemView({model: taskboard});
    this.$liTaskboardAdd.before(viewTaskboard.render().el);
    taskboard.on('destroy', function() {
      viewTaskboard.remove();
    })
  },
  fixWidth: function() {
    var width = this.$liTaskboardAdd.width();
    var margin = 2 * parseInt(this.$liTaskboardAdd.css('margin-left'));
    var padding = 2 * parseInt(this.$liTaskboardAdd.css('padding-left'));
    var border = 2;
    var actualWidth =  width + margin + padding + border;
    this.$el.css({width: (this.taskboards.length + 1) * actualWidth});
  }
});

module.exports = TaskboardsView;