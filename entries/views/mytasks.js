var User = require('../models/user');
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
    'click .tab': 'switchTab',
    'click .avatar': 'selectAvatar',
    'click #info-update': 'updateInfo',
    'click #password-update': 'updatePassword'
  },
  initialize: function() {
    this.user = new User();
    this.tasks = new Tasks();
    this.tasks.on('reset', this.renderList, this);
    this.tasks.on('add', this.renderItem, this);
  },
  render: function() {
    var self = this;
    this.user.fetch({
      wait: true,
      reset: true,
      url: '/users/own/profile',
      success: function(user) {
        var data = user.toJSON();
        data.avatar = data.avatar || '/images/default.png';
        self.$el.html(tplMytasks(data));
        self.tasks.fetch({
          wait: true,
          url: '/users/own/tasks',
          data: {
            type: $('.tab.active').data('index')
          },
          reset: true
        });
      },
      error: function(model, xhr, options) {
        alert('warning', xhr.responseJSON.msg);
      }
    })
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
    var self = this;
    if (!$cur.hasClass('active') || $cur.data('index') != 'profile') {
      this.tasks.fetch({
        wait: true,
        url: '/users/own/tasks',
        data: {
          type: $cur.data('index')
        },
        reset: true
      });
    }
  },
  selectAvatar: function(e) {
    var $avatar = $(e.currentTarget);
    var $input = $avatar.next('input');
    $input
    .click()
    .on('change', function(e) {
      var files = $(this).get(0).files;
      if (files && files[0]) {
        var fr= new FileReader();
        fr.onload = function(e) {
          console.log(e.target.result);
          $avatar.attr('src', e.target.result);
        };       
        fr.readAsDataURL(files[0]);
      }
    });
  },
  updateInfo: function() {
    var self = this;
    var $formProfile = $('.profile');
    var avatar = $formProfile.find('input[name="avatar"]').val();
    var email = $formProfile.find('input[name="email"]').val();
    var nickname = $formProfile.find('input[name="nickname"]').val();
    var description = $formProfile.find('textarea[name="description"]').val();
    this.user
    .save({
      avatar: avatar,
      email: email,
      nickname: nickname,
      description: description
    }, {
      wait: true,
      success: function() {
        alert('success', '更新成功');
      },
      error: function(model, xhr, options) {
        alert('warning', xhr.responseJSON.msg);
      }
    });
  },
  updatePassword: function() {
    var self = this;
    var $formProfile = $('.profile');
    var passwordOld = $formProfile.find('input[name="password_old"]').val();
    var passwordNew = $formProfile.find('input[name="password_new"]').val();
    if (passwordOld && passwordNew) {
      this.user
      .save({},{
        data: {
          passwordOld: passwordOld,
          passwordNew: passwordNew
        },
        wait: true,
        processData: true,
        success: function() {
          alert('success', '更新成功');
        },
        error: function(model, xhr, options) {
          alert('warning', xhr.responseJSON.msg);
        }
      });
    }
  }
});

module.exports = MyTaskView;