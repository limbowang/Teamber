var Members = require('../collections/members');
var Assignments = require('../collections/assignments');
var Comments = require('../collections/comments');
var Checkitems = require('../collections/checkitems');
var Histories = require('../collections/histories');
var Subtasks = require('../collections/tasks');
var tplTaskView = require('../templates/board/task/taskview.handlebars');
var tplCheckitemView = require('../templates/board/task/checkitem.handlebars');
var tplCommentView = require('../templates/board/task/comment.handlebars');
var tplHistoryView = require('../templates/board/task/history.handlebars');
var tplSubtaskView = require('../templates/board/task/subtask.handlebars');
var tplCheckitemAddView = require('../templates/board/task/checkitemadd.handlebars');
var tplCommentAddView = require('../templates/board/task/commentadd.handlebars');
var tplSubtaskAddView = require('../templates/board/task/subtaskadd.handlebars');
var tplAssignmentView = require('../templates/board/assign/userview.handlebars');
var tplUserItemView = require('../templates/board/assign/memberitem.handlebars');
var tplInviteItemView = require('../templates/board/assign/inviteitem.handlebars');

var InviteItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'user',
  events: {
    'click': 'changeState'
  },
  render: function() {
    var data = this.model.toJSON();
    data.avatar = data.avatar || '/images/default.png';
    var html = tplInviteItemView(data);
    this.$el.html(html);
    return this;
  },
  changeState: function() {
    this.model.set('assigned', !this.model.get('assigned'));
  }
});

var UserItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'user',
  render: function() {
    var data = this.model.toJSON();
    data.avatar = data.avatar || '/images/default.png';
    var html = tplUserItemView(data);
    this.$el.html(html);
    return this;
  }
});

var AssignmentListView = Backbone.View.extend({
  className: 'assignments',
  events: {
    'click .invite-button': 'renderInvite',
    'click .invite-close': 'hideInvite'
  },
  initialize: function() {
    this.members = new Members();
    this.members.on('add', this.renderInviteItem, this);
    this.collection.on('add', this.renderUserItem, this);
  },
  render: function() {
    var html = tplAssignmentView();
    this.$el.html(html);
    this.$userlist = this.$el.find('.user-list');
    this.$invite = this.$el.find('.invite');
    this.$invitelist = this.$invite.find('.invite-list');
    return this;
  },
  renderUserItem: function(assignment) {
    var view = new UserItemView({model: assignment});
    this.$userlist.append(view.render().el);
    assignment.on('destroy', function() {
      view.remove();
    });
  },
  renderInviteItem: function(member) {
    var self = this;
    if (this.collection.findWhere({email: member.get('email')})) {
      member.set('assigned', true);
    } else {
      member.set('assigned', false);
    }
    var view = new InviteItemView({model: member});
    this.$invitelist.append(view.render().el);
    member.on('change:assigned', function(member) {
      var email = member.get('email');
      if (member.get('assigned')) {
        self.collection.create({
          email: email
        }, {
          wait: true,
          taskid: self.collection.taskid,
          success: function() {
            view.render();
          },
          error: function(model, xhr, options) {
            alert('warning', xhr.responseJSON.msg);
          }
        })
      } else {
        self.collection.findWhere({email: email}).destroy({
          wait: true,
          taskid: self.collection.taskid,
          success: function() {
            view.render(); 
          },
          error: function(model, xhr, options) {
            alert('warning', xhr.responseJSON.msg);
          }
        });
      }
    });
    member.on('destroy', function() {
      view.remove();
    });
  },
  renderInvite: function() {
    this.members.fetch({teamid: this.teamid});
    this.$invite.show();
    this.$userlist.hide();
  },
  hideInvite: function() {
    this.$invite.hide();
    this.$userlist.show();
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
      },
      error: function(model, xhr, options) {
        alert('warning', xhr.responseJSON.msg);
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
      },
      error: function(model, xhr, options) {
        alert('warning', xhr.responseJSON.msg);
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
      },
      error: function(model, xhr, options) {
        alert('warning', xhr.responseJSON.msg);
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
    'click .tab': 'switchTab',
    'change .complete': 'updateComplete'
  },
  initialize: function() {
    this.comments = new Comments();
    this.checkitems = new Checkitems();
    this.assignments = new Assignments();
    this.histories = new Histories();
    this.subtasks = new Subtasks();
    this.comments.taskid = this.checkitems.taskid = this.histories.taskid =
      this.assignments.taskid = this.subtasks.ptaskid = this.model.get('id');
    // delegate events on task
    this.model.on('change:due_time', this.updateDueTime, this);
    // delegate contributors
    if (this.model.contributors) {
      this.assignments.on('add', function() { this.model.contributors.fetch() }, this);
      this.assignments.on('destroy', function() { this.model.contributors.fetch() }, this);
    }
  },
  render: function() {
    var self = this;
    this.model.fetch({
      success: function(task) {
        var data = self.model.toJSON();
        data.due_time = self.formatDate(data.due_time);
        var html = tplTaskView(data);
        self.$el.html(html).show();
        // set due
        self.$dueTime = self.$el.find('.due > .time');
        self.$datepanel = self.$el.find('.datepanel');
        self.bindDatepanelEvents();
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
        // render assignments
        var viewAssignments = new AssignmentListView({collection: self.assignments});
        // hack team id
        if (task.get('team_id') || task.get('team_id') === 0) {
          viewAssignments.teamid = task.get('team_id');
        }
        self.$el.find('.small-col').html(viewAssignments.render().el);
        // initialize list
        self.checkitems.fetch();
        self.assignments.fetch();
      },
      error: function(model, xhr, options) {
        alert('warning', xhr.responseJSON.msg);
      }
    });
  },
  bindDatepanelEvents: function() {
    var self = this;
    $('.set-due').on('click', function() {
      if (self.$datepanel.hasClass('hide')) {
        self.$datepanel.removeClass('hide');
      } else {
        self.$datepanel.addClass('hide');
      }
    })
    self.$datepanel.find('.datepicker')
      .datepicker()
      .on('changeDate', function(ev) {
        var date = self.formatDate(ev.date);
        if (self.model.get('due_time') != date) {
          self.model.set('due_time', date);
        }
        self.$datepanel.addClass('hide');
      });
    self.$datepanel.find('.btn-cancel')
      .on('click', function() {
        self.model.set('due_time', null);
        self.$datepanel.addClass('hide');
      })
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
      case 'checkitem':
        this.checkitems.fetch();
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
  },
  updateDueTime: function(model) {
    var self = this;
    var time = model.get('due_time');
    model.save({
      'due_time': time
    }, {
      wait: true,
      success: function() {
        self.$dueTime.html(self.formatDate(time));
      },
      error: function(model, xhr, options) {
        alert('warning', xhr.responseJSON.msg);
      }
    })
  },
  updateComplete: function() {
    this.model.save({
      isComplete: (this.model.get('complete_at') == null).toString()
    })
  },
  formatDate: function(time) {
    var date = null;
    if (time) {
      date = new Date(time);
      date = date.getFullYear() + '-' + date.getMonthFormatted() + '-' + date.getDateFormatted();
    }
    return date;
  }
});

module.exports = TaskView;