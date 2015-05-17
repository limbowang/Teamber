var Taskboards = require('../collections/taskboards');
var Tasks = require('../models/task');
var TaskView = require('../task');
var tplTaskboardItem = require('../templates/board/task/taskboarditem.handlebars');
var tplTaskItem = require('../templates/board/task/taskitem.handlebars');
var tplTaskboardAdd =require('../templates/board/task/taskboardadd.handlebars');
var tplTaskAdd =require('../templates/board/task/taskadd.handlebars');

var TaskItemView = Backbone.View.extend({
  tagName: 'li',
  render: function() {

  }
});

var TaskboardItemView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    
  }
});

var TaskboardsView = Backbone.View.extend({
  tagName: 'ul',
  className: 'taskboard-list',
  subprojid: 0,
  render: function() {

  }
});

module.exports = TaskboardsView;