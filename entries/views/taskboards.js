var Taskboards = require('../collections/taskboards');
var Tasks = require('../collections/tasks');
var TaskView = require('./task');
var tplTaskboardItem = require('../templates/board/task/taskboarditem.handlebars');
var tplTaskItem = require('../templates/board/task/taskitem.handlebars');
var tplTaskboardAdd =require('../templates/board/task/taskboardadd.handlebars');
var tplTaskAdd =require('../templates/board/task/taskadd.handlebars');

var TaskItemView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    var html = tplTaskItem(this.model.toJSON());
    this.$el.html(html);
    return this;
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
      taskboardid: this.collection.taskboardid
    }, {
      wait: true,
      success: function(subproj) { 
        self.renderCancel();
      },
      error: function(model, xhr, options) { console.log(xhr); }
    });
  }
});

var TaskboardItemView = Backbone.View.extend({
  tagName: 'li',
  initialize: function() {
    this.$tasklist = this.$el.find('.task-list');
    this.tasks = new Tasks();
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

    this.tasks.taskboardid = this.model.get('id');
    this.tasks.add(this.model.get('Tasks'));
    return this;
  },
  renderTaskList: function() {
    this.tasks.each(this.renderTaskItem, this);
  },
  renderTaskItem: function(task) {
    var viewTask = new TaskItemView({model: task});
    this.$liAddTask.before(viewTask.render().el);
    task.on('destroy', function() {
      viewTask.remove();
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
      error: function(model, xhr, options) { console.log(xhr); }
    });
  }
})

var TaskboardsView = Backbone.View.extend({
  tagName: 'ul',
  className: 'taskboard-list',
  subprojid: 0,
  initialize: function() {
    this.taskboards = new Taskboards();
    this.taskboards.on('reset', this.render, this);
    this.taskboards.on('add', this.renderTaskboardItem, this);
    this.taskboards.on('reset', this.fixWidth, this);
    this.taskboards.on('add', this.fixWidth, this);
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
    var actualWidth =  width + margin + padding;
    this.$el.css({width: (this.taskboards.length + 1) * actualWidth});
  }
});

module.exports = TaskboardsView;