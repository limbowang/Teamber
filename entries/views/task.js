var Comments = require('../collections/comments');
var Checkitems = require('../collections/checkitems');
var Assignments = require('../collections/assignments');
var Histories = require('../collections/histories');
var Subtasks = require('../collections/tasks');
var tplTaskView = require('../templates/board/task/taskview.handlebars');
var tplCheckitemView = require('../templates/board/task/checkitem.handlebars');
var tplCommentView = require('../templates/board/task/comment.handlebars');
var tplHistoryView = require('../templates/board/task/history.handlebars');
var tplAssignmentView = require('../templates/board/task/assignment.handlebars');
var tplSubtaskView = require('../templates/board/task/subtask.handlebars');
var tplCheckitemAddView = require('../templates/board/task/checkitemadd.handlebars');
var tplCommentAddView = require('../templates/board/task/commentadd.handlebars');
var tplAssignmentAddView = require('../templates/board/task/assignmentadd.handlebars');
var tplSubtaskAddView = require('../templates/board/task/subtaskadd.handlebars');


var AssignmentView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    var html = tplAssignmentView(this.model.toJSON());
    this.$el.html(html);
    return this;
  }
});

var AssignmentListView = Backbone.View.extend({
  tagName: 'ul',
  className: 'assignments',
  render: function() {
    var html = tplAssignmentAddView();
    this.$el.html(html);
    this.$assignmentAdd = this.$el.find('.assignment-add');
    this.collection.on('add', this.renderItem, this);
    return this;
  },
  renderItem: function(assignment) {
    var view = new AssignmentView({model: assignment});
    this.$assignmentAdd.before(view.render().el);
    assignment.on('destroy', function() {
      view.remove();
    });
  }
});

var SubtaskView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    var html = tplSubtaskView(this.model.toJSON());
    this.$el.html(html);
    return this;
  }
});

var SubtaskListView = Backbone.View.extend({
  tagName: 'ul',
  className: 'subtasks',
  events: {
    'click [data-action="add"]': 'renderForm',
    'click [data-action="cancel"]': 'clearForm',
    'click [data-action="create"]': 'createSubtask'
  },
  render: function() {
    var html = tplSubtaskAddView();
    this.$el.html(html);
    this.$subtaskAdd = this.$el.find('.subtask-add');
    this.collection.on('add', this.renderItem, this);
    return this;
  },
  renderItem: function(subtask) {
    var view = new SubtaskView({model: subtask});
    this.$subtaskAdd.before(view.render().el);
    subtask.on('destroy', function() {
      view.remove();
    });
  },
  renderForm: function() {
    this.$subtaskAdd.find('[data-action="add"]').addClass('hide');
    this.$subtaskAdd.find('.subtask-form').removeClass('hide');
  },
  clearForm: function() {
    this.$subtaskAdd.find('[data-action="add"]').removeClass('hide');
    this.$subtaskAdd.find('.subtask-form').addClass('hide');
  },
  createSubtask: function() {
    var self = this;
    var $textarea = this.$subtaskAdd.find('[name="name"]');
    var name = $textarea.val();
    this.collection.create({
      name: name,
      ptaskid: this.collection.ptaskid
    }, {
      wait: true,
      success: function() {
        $textarea.val('');
        alert('success', '添加成功');
      }
    })
  }
});

var CheckitemView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click [data-action="delete"]': 'removeCheckitem'
  },
  render: function() {
    var html = tplCheckitemView(this.model.toJSON());
    this.$el.html(html);
    return this;
  },
  removeCheckitem: function() {
    this.model.destroy();
  }
});

var CheckitemListView = Backbone.View.extend({
  tagName: 'ul',
  className: 'checkitems',
  events: {
    'click [data-action="add"]': 'renderForm',
    'click [data-action="cancel"]': 'clearForm',
    'click [data-action="create"]': 'createCheckitem'
  },
  render: function() {
    var html = tplCheckitemAddView();
    this.$el.html(html);
    this.$checkitemAdd = this.$el.find('.checkitem-add');
    this.collection.on('add', this.renderItem, this);
    return this;
  },
  renderItem: function(checkitem) {
    var view = new CheckitemView({model: checkitem});
    this.$checkitemAdd.before(view.render().el);
    checkitem.on('destroy', function() {
      view.remove();
    });
  },
  renderForm: function() {
    this.$checkitemAdd.find('[data-action="add"]').addClass('hide');
    this.$checkitemAdd.find('.checkitem-form').removeClass('hide');
  },
  clearForm: function() {
    this.$checkitemAdd.find('[data-action="add"]').removeClass('hide');
    this.$checkitemAdd.find('.checkitem-form').addClass('hide');
  },
  createCheckitem: function() {
    var self = this;
    var $textarea = this.$checkitemAdd.find('[name="content"]');
    var content = $textarea.val();
    this.collection.create({
      content: content,
      taskid: this.collection.taskid
    }, {
      wait: true,
      success: function() {
        $textarea.val('');
        alert('success', '添加成功');
      }
    })
  }
});

var CommentItemView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click [data-action="delete"]': 'removeComment'
  },
  render: function() {
    var html = tplCommentView(this.model.toJSON());
    this.$el.html(html);
    return this;
  },
  removeComment: function() {
    this.model.destroy();
  }
});

var CommentListView = Backbone.View.extend({
  tagName: 'ul',
  className: 'comments',
  events: {
    'click .btn-comment': 'createComment',
    'add collection': 'renderItem'
  },
  render: function() {
    var html = tplCommentAddView();
    this.$el.html(html);
    this.$commentAdd = this.$el.find('.comment-add');
    this.collection.on('add', this.renderItem, this);
    return this;
  },
  renderItem: function(comment) {
    var view = new CommentItemView({model: comment});
    this.$commentAdd.before(view.render().el);
    comment.on('destroy', function() {
      view.remove();
    })
  },
  createComment: function() {
    var self = this;
    var $textarea = this.$commentAdd.find('[name="content"]');
    var content = $textarea.val();
    this.collection.create({
      content: content,
      taskid: this.collection.taskid
    }, {
      wait: true,
      success: function() {
        $textarea.val('');
        alert('success', '评论成功');
      }
    })
  }
});

var HistoryListView = Backbone.View.extend({
  tagName: 'ul',
  className: 'histories',
  render: function() {
    this.$el.html('');
    this.collection.on('add', this.renderItem, this);
    return this;
  },
  renderItem: function(history) {
    var html = tplHistoryView(history.toJSON());
    this.$el.append(html);
  }
});

var TaskView = Backbone.View.extend({
  el: '#modal',
  events: {
    'click .tab': 'switchTab'
  },
  initialize: function() {
    this.comments = new Comments();
    this.checkitems = new Checkitems();
    this.assignments = new Assignments();
    this.histories = new Histories();
    this.subtasks = new Subtasks();
    this.comments.taskid = this.checkitems.taskid = this.histories.taskid =
      this.assignments.taskid = this.subtasks.ptaskid = this.model.get('id');
  },
  render: function() {
    var self = this;
    this.model.fetch({
      success: function(task) {
        var html = tplTaskView(self.model.toJSON());
        self.$el.html(html).show();
        // render comments
        var viewComments = new CommentListView({collection: self.comments});
        self.$el.find('.tab-pane[data-index="comment"]').html(viewComments.render().el);
        // render histories
        var viewHistories = new HistoryListView({collection: self.histories});
        self.$el.find('.tab-pane[data-index="history"]').html(viewHistories.render().el);
        // render checkitems
        var viewCheckitems = new CheckitemListView({collection: self.checkitems});
        self.$el.find('.tab-pane[data-index="checkitem"]').html(viewCheckitems.render().el);
        // render subtasks
        var viewSubtasks = new SubtaskListView({collection: self.subtasks});
        self.$el.find('.tab-pane[data-index="subtask"]').html(viewSubtasks.render().el);
        // initialize list
        self.checkitems.fetch();
        // render assignments
        // var viewAssignments = new AssignmentListView({collection: self.assignments});
        // self.$el.find('.tab-pane[data-index="assignment"]').html(viewAssignments.render().el);
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
    switch(index) {
      case 'comment':
        this.comments.fetch();
        break;
      case 'subtask':
        this.subtasks.fetch();
        break;
      case 'subtask':
        this.subtasks.fetch();
        break;
      case 'history':
        this.histories.fetch();
        break;
      default:
        break;
    }
  }
});

module.exports = TaskView;