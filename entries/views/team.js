var Team = require('../models/team');
var Member = require('../models/member');
var Proj = require('../models/proj');
var tplTeamAdd = require('../templates/modal/teamadd.handlebars');
var tplTeamItem = require('../templates/sidebar/teamitem.handlebars');
var tplBoard = require('../templates/board/team/board.handlebars');
var tplMemberItem = require('../templates/board/team/memberitem.handlebars');
var tplProjItem = require('../templates/board/team/projitem.handlebars');

var TeamItemView = Backbone.View.extend({
  el: '#team-list',
  render: function() {
    var html = tplTeamItem(this.model.toJSON());
    this.$el.append(html);
    return this;
  }
});

var MemberItemView = Backbone.View.extend({
  el: '#board .member-list',
  render: function() {
    var data = this.model.toJSON();
    data.avatar = data.avatar || '/images/default.png';
    var html = tplMemberItem(data);
    this.$el.append(html);
    return this;
  }
});

var ProjItemView = Backbone.View.extend({
  el: '#board .proj-list',
  render: function() {
    var html = tplProjItem(this.model.toJSON());
    this.$el.append(html);
    return this;
  }
});

var TeamView = BaseView.extend({
  teamid: -1,
  initialize: function() {
    this.$teamchosen = $('#team-chosen span');
    this.$teamlist = $('#team-list');
    // teams
    // this.teams = new Teams();
    this.teams.on('reset', this.renderTeamList, this);
    this.teams.on('add', this.renderTeamItem, this);
    this.teams.fetch({reset: true});
    // members
    // this.members = new Members();
    this.members.on('reset', this.renderMemberList, this);
    // projects
    // this.projs = new Projs();
    this.projs.on('reset', this.renderProjList, this);
    this.projs.on('add', this.renderProjItem, this);
  },
  events: {
    'click #team-new': 'renderTeamCreateModal',
    'click #team-add': 'createTeam',
    'click .tab': 'switchTab'
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
        location.href = '/';
      }
    }
  },
  renderTeamChosen: function() {
    this.$teamchosen.html($('#team-' + this.teamid).data('name'));
  },
  renderTeamList: function() {
    if (this.teams.length != 0) {
      this.$teamlist.append('<li class="divider"></li>');
      this.teams.each(this.renderTeamItem);
    }
  },
  renderMemberList: function() {
    this.members.each(this.renderMemberItem);
  },
  renderProjList: function() {
    this.projs.each(this.renderProjItem);
  },
  renderTeamItem: function(team) {
    var view = new TeamItemView({model: team});
    view.render();
  },
  renderMemberItem: function(member) {
    var view = new MemberItemView({model: member});
    view.render();
  },
  renderProjItem: function(proj) {
    var view = new ProjItemView({model: proj});
    view.render();
  },
  renderTeamCreateModal: function() {
    var html = tplTeamAdd();
    this.$modal.html(html).show();
  },
  createTeam: function() {
    var self = this;
    var name = this.$modal.find('input[name="name"]').val();
    var description = this.$modal.find('input[name="description"]').val();
    this.teams.create({
      name: name,
      description: description
    }, {
      wait: true,
      url: 'teams/create',
      success: function(team, res, options) {
        self.$modal.hide();
        location.href = '#team-' + team.get('id');
      }
    });
  },
  switchTab: function(e) {
    var $cur = $($e.currentTarget);
    var index = $cur.data('index');
    this.$board.find('.tab.active').removeClass('active');
    this.$board.find('.panel.active').removeClass('active');
    $cur.addClass('active');
    this.$board.find('.panel[data-index=' + index + ']').addClass('active');
  }
});

module.exports = TeamView;