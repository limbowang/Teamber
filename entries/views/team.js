var Team = require('../models/team');
var Member = require('../models/member');
var Proj = require('../models/proj');
var tplBoard = require('../templates/board/team/board.handlebars');
var tplTeamAdd = require('../templates/modal/teamadd.handlebars');
var tplTeamItem = require('../templates/sidebar/teamitem.handlebars');
var tplMemberItem = require('../templates/board/team/memberitem.handlebars');
var tplMemberTD = require('../templates/board/team/membertd.handlebars');
var tplMemberAdd = require('../templates/modal/memberadd.handlebars');
var tplMemberView = require('../templates/board/team/memberview.handlebars');
var tplProjItem = require('../templates/board/team/projitem.handlebars');

var TeamItemView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    var html = tplTeamItem(this.model.toJSON());
    this.$el.html(html);
    return this;
  }
});

var MemberItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'member',
  events: {
    'click': 'renderMemberProfile'
  },
  render: function() {
    var data = this.model.toJSON();
    data.avatar = data.avatar || '/images/default.png';
    var html = tplMemberItem(data);
    this.$el.append(html);
    return this;
  },
  renderMemberProfile: function() {
    var $profile = this.$el.find('.profile');
    if ($profile.length != 0) {
      $profile.remove();
    }
    var data = this.model.toJSON();
    data.avatar = data.avatar || '/images/default.png';
    var html = tplMemberView(data);
    this.$el.append(html);
    $profile = this.$el.find('.profile');
    setTimeout(function() {
      $(document).on('click', onClick);
      function onClick(e) {
        $profile.remove();
        $(document).off('click', onClick);
      }
    }, 0);
  }
});

var MemberItemTD = Backbone.View.extend({
  tagName: 'tr',
  events: {
    'click [data-action="delete"]': 'renderConfirm',
    'click [data-action="confirm"]': 'removeMember',
    'click [data-action="cancel"]': 'renderCancel'
  },
  render: function() {
    var html = tplMemberTD(this.model.toJSON());
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

var ProjItemView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    var html = tplProjItem(this.model.toJSON());
    this.$el.html(html);
    return this;
  }
});

var TeamView = BaseView.extend({
  teamid: -1,
  initialize: function() {
    this.$teamchosen = $('#team-chosen span');
    this.$teamlist = $('#team-list');
    // teams
    this.teams.on('reset', this.renderTeamList, this);
    this.teams.on('add', this.renderTeamItem, this);
    this.teams.fetch({reset: true});
    // members
    this.members.on('reset', this.renderMemberList, this);
    this.members.on('add', this.renderMemberItem, this);
    // projects
    this.projs.on('reset', this.renderProjList, this);
    this.projs.on('add', this.renderProjItem, this);
  },
  events: {
    'click #team-new': 'renderTeamCreateModal',
    'click #team-add': 'createTeam',
    'click #team-update': 'updateTeam',
    'click #team-delete': 'deleteTeam',
    'click .member-invite': 'renderMemberInviteModal',
    'click #member-add': 'addMember',
    'click #board .tab': 'switchTab'
  },
  render: function() {
    this.renderTeamChosen();
    if (this.teamid != '0') {
      var team = this.teams.findWhere({id: parseInt(this.teamid)});
      if (team) {
        var html = tplBoard(team.toJSON());
        this.$board.html(html);
        this.members.fetch({reset: true, teamid: this.teamid});
      } else {
        location.href = '#';
      }
    }
  },
  renderTeamChosen: function() {
    this.$teamchosen.html($('#team-' + this.teamid).data('name'));
  },
  renderTeamList: function() {
    if (this.teams.length != 0) {
      this.$teamlist.append('<li class="divider"></li>');
      this.teams.each(this.renderTeamItem, this);
    }
  },
  renderMemberList: function() {
    this.members.each(this.renderMemberItem, this);
  },
  renderProjList: function() {
    this.projs.each(this.renderProjItem, this);
  },
  renderTeamItem: function(team) {
    var self = this;
    var viewTeamItem = new TeamItemView({model: team});
    $('#team-list').append(viewTeamItem.render().el);
    team.on('change:name', function(team) {
      viewTeamItem.render();
      this.$board.find('>.header >.title').html(team.get('name'));
      this.renderTeamChosen();
    }, this);
    team.on('destroy', function() {
      viewTeamItem.remove();
    });
  },
  renderMemberItem: function(member) {
    var viewItem = new MemberItemView({model: member});
    this.$board.find('.member-list').append(viewItem.render().el);
    var viewTd = new MemberItemTD({model: member});
    this.$board.find('.members-table').append(viewTd.render().el);
    member.on('change', function() {
      viewItem.render();
      viewTd.render();
    })
    member.on('destroy', function() {
      viewItem.remove();
      viewTd.remove();
    })
  },
  renderProjItem: function(proj) {
    var view = new ProjItemView({model: proj});
    this.$board.find('.projs-list').append(view.render().el);
    proj.on('change', function() {
      view.render();
    })
    proj.on('destroy', function() {
      view.remove();
    })
  },
  renderTeamCreateModal: function() {
    var html = tplTeamAdd();
    this.$modal.html(html).show();
  },
  renderMemberInviteModal: function() {
    var html = tplMemberAdd();
    this.$modal.html(html).show();
  },
  createTeam: function() {
    var self = this;
    var name = this.$modal.find('input[name="name"]').val();
    var description = this.$modal.find('textarea[name="description"]').val();
    this.teams.create({
      name: name,
      description: description
    }, {
      wait: true,
      success: function(team, res, options) {
        self.$modal.hide();
        location.href = '#team-' + team.get('id');
      }
    });
  },
  updateTeam: function() {
    var self = this;
    var $formTeam = $('#team-info');
    var name = $formTeam.find('input[name="name"]').val();
    var description = $formTeam.find('textarea[name="description"]').val();
    this.teams
    .findWhere({id: parseInt(this.teamid)})
    .save({
      name: name,
      description: description
    }, {
      wait: true,
      success: function() {
        self.alert('success', '更新成功');
      }
    });
  },
  deleteTeam: function(e) {
    var self = this;
    var $cur = $(e.currentTarget);
    var $confirm = $cur.next('.confirm');
    var $btnCancel = $confirm.find('[data-action="cancel"]');
    var $btnConfirm = $confirm.find('[data-action=confirm]');

    $cur.addClass('hide')
    $confirm.removeClass('hide');

    $btnCancel.on('click', function() {
      $cur.removeClass('hide');
      $confirm.addClass('hide');
    })

    $btnConfirm.on('click', function() {
        self.teams
        .findWhere({id: parseInt(self.teamid)})
        .destroy({
          success: function() {
            self.alert('success', '操作成功');
            location.href = '#';
          }
        })
      });
  },
  addMember: function() {
    var self = this;
    var email = this.$modal.find('input[name="email"]').val();
    this.members.create({
      email: email
    }, {
      wait: true,
      url: 'teams/' + this.teamid + '/members/add',
      success: function(member, res, options) {
        self.$modal.hide();
      }
    })
  },
  switchTab: function(e) {
    var $cur = $(e.currentTarget);
    var index = $cur.data('index');
    this.$board.find('.tab.active').removeClass('active');
    this.$board.find('.panel.active').removeClass('active');
    $cur.addClass('active');
    this.$board.find('.panel[data-index=' + index + ']').addClass('active');
  }
});

module.exports = TeamView;