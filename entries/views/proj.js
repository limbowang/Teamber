var Projs = require('../collections/projs');
var Subprojs = require('../collections/subprojs');
var Contributors = require('../collections/contributors');
var Proj = require('../models/proj');
var TaskboardsView = require('./taskboards');
var tplProjItem = require('../templates/sidebar/projitem.handlebars');
var tplBoard = require('../templates/board/proj/board.handlebars');
var tplSubProjItem = require('../templates/board/proj/subprojitem.handlebars');
var tplContributorItem = require('../templates/board/proj/contributoritem.handlebars');
var tplProjAdd = require('../templates/modal/projadd.handlebars');
var tplSubrojAdd = require('../templates/modal/subprojadd.handlebars');

var ContributorItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'user',
  render: function() {
    var html = tplContributorItem(this.model.toJSON());
    this.$el.html(html);
    return this;
  }
});

var ProjItemView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    var html = tplProjItem(this.model.toJSON());
    this.$el.html(html);
    return this;
  }
});

var SubProjItemView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    var html = tplSubProjItem(this.model.toJSON());
    this.$el.html(html);
    return this;
  }
});

var ProjView = BaseView.extend({
  projid: -1,
  events: {
    'click .proj-new': 'renderCreateProjModal',
    'click .subproj-new': 'renderCreateSubprojModal',
    'click #proj-add': 'createProj',
    'click #subproj-add': 'createSubproj'
  },
  initialize: function() {
    this.$projlist = $('#proj-list');
    this.subprojs = new Subprojs();
    this.contributors = new Contributors();
    this.projs.on('reset', this.renderProjList, this);
    this.projs.on('add', this.renderProjItem, this);
    this.subprojs.on('reset', this.renderSubprojList, this);
    this.subprojs.on('add', this.renderSubprojItem, this);
    this.contributors.on('reset', this.renderContributorList, this);
    this.contributors.on('add', this.renderContributorItem, this);
  },
  render: function() {
    var proj = this.projs.findWhere({id: parseInt(this.projid)});
    if (proj) {
      var html = tplBoard(proj.toJSON());
      this.$board.html(html);
      this.$subprojlist = $('#subproj-list');
      this.$subprojSelect = $('#subproj-select > span');
      this.$panelTasks = $('.panel[data-index="tasks"] .content');
      this.$contributorList = $('.contributor-list');
      this.subprojs.projid = this.projid;
      this.contributors.projid = this.projid;
      this.subprojs.fetch({reset: true});
      this.contributors.fetch({reset: true});
    } else {
      location.href = '#';
    }
  },
  renderProjList: function() {
    this.$projlist.html('');
    this.projs.each(this.renderProjItem, this);
  },
  renderSubprojList: function() {
    this.subprojs.each(this.renderSubprojItem, this);
    if (this.subprojs.length > 0) {
      this.renderSubprojPanel(this.subprojs.at(0));
    }
  },
  renderContributorList: function() {
    this.$contributorList.html('');
    this.contributors.each(this.renderContributorItem, this);
  },
  renderProjItem: function(proj) {
    var view = new ProjItemView({model: proj});
    this.$projlist.append(view.render().el);
    proj.on('destroy', function() {
      view.remove();
    });
  },
  renderSubprojItem: function(subproj) {
    var self = this;
    var view = new SubProjItemView({model: subproj});
    view.$el.on('click', function(){ self.renderSubprojPanel(subproj) });
    this.$subprojlist.append(view.render().el);
    subproj.on('destroy', function() {
      view.remove();
    })
  },
  renderContributorItem: function(contributor) {
    var view = new ContributorItemView({model: contributor});
    this.$contributorList.append(view.render().el);
    contributor.on('remove', function() {
      view.remove();
    })
  },
  renderSubprojPanel: function(subproj) {
    var view = new TaskboardsView({contributors: this.contributors});
    this.$subprojSelect.html(subproj.get('name'));
    this.$panelTasks.html(view.el);
    view.taskboards.projid = subproj.get('project_id');
    view.taskboards.subprojid = subproj.get('id');
    view.taskboards.fetch({reset: true});
  },
  renderCreateProjModal: function() {
    var html = tplProjAdd();
    this.$modal.html(html).show();
  },
  renderCreateSubprojModal: function() {
    var html = tplSubrojAdd();
    this.$modal.html(html).show();
  },
  createProj: function() {
    var self = this;
    var name = this.$modal.find('input[name="name"]').val();
    this.projs.create({
      name: name,
      teamid: this.projs.teamid
    }, {
      wait: true,
      success: function(proj) { 
        self.$modal.hide();
        location.href = '#team-' + proj.get('team_id') + '/proj-' + proj.get('id'); 
      },
      error: function(model, xhr, options) { console.log(xhr); }
    });
  },
  updateProj: function() {

  },
  deleteProj: function() {

  },
  createSubproj: function() {
    var self = this;
    var name = this.$modal.find('input[name="name"]').val();
    this.subprojs.create({
      name: name,
      projid: this.subprojs.projid
    }, {
      wait: true,
      success: function(subproj) { 
        self.$modal.hide();
        self.renderSubprojPanel(subproj);
      },
      error: function(model, xhr, options) { console.log(xhr); }
    });
  },
  updateSubproj: function() {

  },
  deleteSubproj: function() {

  }
});

module.exports = ProjView;