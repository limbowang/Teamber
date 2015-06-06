var Projs = require('../collections/projs');
var Subprojs = require('../collections/subprojs');
var Contributors = require('../collections/contributors');
var Proj = require('../models/proj');
var TaskboardsView = require('./taskboards');
var tplProjItem = require('../templates/sidebar/projitem.handlebars');
var tplBoard = require('../templates/board/proj/board.handlebars');
var tplSubProjItem = require('../templates/board/proj/subprojitem.handlebars');
var tplSubProjTD = require('../templates/board/proj/subprojtd.handlebars');
var tplContributorItem = require('../templates/board/proj/contributoritem.handlebars');
var tplProjAdd = require('../templates/modal/projadd.handlebars');
var tplSubrojAdd = require('../templates/modal/subprojadd.handlebars');

var ContributorItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'user',
  render: function() {
    var data = this.model.toJSON();
    data.avatar = data.avatar || '/images/default.png';
    var html = tplContributorItem(data);
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

var SubProjTDView = Backbone.View.extend({
  tagName: 'tr',
  events: {
    'click [data-action="delete"]': 'renderConfirm',
    'click [data-action="confirm"]': 'removeMember',
    'click [data-action="cancel"]': 'renderCancel'
  },
  render: function() {
    var html = tplSubProjTD(this.model.toJSON());
    this.$el.html(html);
    return this;
  },
  renderConfirm: function(e) {
    var $btnDelete = $(e.currentTarget);
    var $confirm = $btnDelete.next();
    $btnDelete.addClass('hide');
    $confirm.removeClass('hide');
  },
  renderCancel: function(e) {
    var $btnCancel = $(e.currentTarget);
    var $confirm = $btnCancel.parent();
    var $btnDelete = $confirm.prev();
    $btnDelete.removeClass('hide');
    $confirm.addClass('hide');
  },
  removeMember: function(e) {
    var $btnConfirm = $(e.currentTarget);
    $btnConfirm.addClass('btn-disabled').html('删除中');
    this.model.destroy();
  }
});

var ProjView = BaseView.extend({
  projid: -1,
  events: {
    'click .proj-new': 'renderCreateProjModal',
    'click .subproj-new': 'renderCreateSubprojModal',
    'click #proj-add': 'createProj',
    'click #proj-update': 'updateProj',
    'click #proj-delete': 'deleteProj',
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

      proj.on('change:name', function(proj) {
        this.$board.find('>.header >.title').html(proj.get('name'));
        this.$board.find('.overview .title').html(proj.get('name'));
      }, this);
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
    proj.on('change:name', function(proj) {
      view.render();
    }, this);
    proj.on('destroy', function() {
      view.remove();
    });
  },
  renderSubprojItem: function(subproj) {
    var self = this;
    var viewItem = new SubProjItemView({model: subproj});
    this.$subprojlist.append(viewItem.render().el);
    viewItem.$el.on('click', function(){ self.renderSubprojPanel(subproj) });
    var viewTd = new SubProjTDView({model: subproj});
    this.$board.find('.subprojs-table').append(viewTd.render().el);
    subproj.on('destroy', function() {
      viewItem.remove();
      viewTd.remove();
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
    var self = this;
    var $formTeam = $('#proj-info');
    var name = $formTeam.find('input[name="name"]').val();
    this.projs
    .findWhere({id: parseInt($formTeam.data('id'))})
    .save({
      name: name
    }, {
      wait: true,
      success: function() {
        self.alert('success', '更新成功');
      }
    });
  },
  deleteProj: function(e) {
    var self = this;
    var $cur = $(e.currentTarget);
    var $confirm = $cur.next('.confirm');
    var $btnCancel = $confirm.find('[data-action="cancel"]');
    var $btnConfirm = $confirm.find('[data-action=confirm]');
    var projid = parseInt($('#proj-info').data('id'));

    $cur.addClass('hide')
    $confirm.removeClass('hide');

    $btnCancel.on('click', function() {
      $cur.removeClass('hide');
      $confirm.addClass('hide');
    })

    $btnConfirm.on('click', function() {
        self.projs
        .findWhere({id: projid})
        .destroy({
          success: function() {
            self.alert('success', '操作成功');
            if (parseInt(self.projs.teamid)) {
              location.href = '#team-' + self.projs.teamid;
            } else {
              location.href = '#';
            }
          }
        })
      });
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