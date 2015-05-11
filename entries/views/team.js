var Teams = require('../collections/teams');
var Team = require('../models/team');
var tplSidebar = require('../templates/sidebar/teamlist.handlebars');
var tplTeamAdd = require('../templates/modal/teamadd.handlebars');

var TeamView = BaseView.extend({
  initialize: function() {
    this.$teamlist = this.$sidebar.find('.team-list');
    this.teams = new Teams();
    this.teams.on('reset', this.render, this);
    // this.teams.on('add', this.showNewTeam);
    this.teams.fetch({reset: true});
  },
  events: {
    'click #team-new': 'showCreateTeamModal',
    'click #team-add': 'createTeam'
  },
  render: function() {
    var htmlSidebar = tplSidebar({
      cur: this.cur || '私人项目',
      teams: this.teams.toJSON()
    });
    this.$teamlist.html(htmlSidebar);
  },
  createTeam: function() {
    var self = this;
    var name = this.$modal.find('input[name="name"]').val();
    var description = this.$modal.find('input[name="description"]').val();
    var newTeam = this.teams.create({
      name: name,
      description: description
    }, {
      wait: true,
      url: 'teams/create',
      success: function() { self.showNewTeam(newTeam); }
    });
  },
  showCreateTeamModal: function() {
    var html = tplTeamAdd();
    this.$modal.html(html).show();
  },
  showNewTeam: function(team) {
    this.$modal.hide();
    var tpl = hbs.compile('<li class="list-item"><a href="#" >{{ name }}</a></li>');
    var item = tpl(team.toJSON());
    this.$teamlist.find('.dropdown-menu').append(item);
  }
});

module.exports = TeamView;