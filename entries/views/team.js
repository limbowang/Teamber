var Teams = require('../collections/teams');
var Team = require('../models/team');
var ProjView = require('../views/proj');
var tplTeamAdd = require('../templates/modal/teamadd.handlebars');
var tplListItem = require('../templates/sidebar/teamitem.handlebars');

var TeamItemView = Backbone.View.extend({
  el: '#team-list',
  render: function() {
    var html = tplListItem(this.model.toJSON());
    this.$el.append(html);
    return this;
  }
});

var TeamView = BaseView.extend({
  teamid: -1,
  initialize: function() {
    this.$teamchosen = $('#team-chosen span');
    this.$teamlist = $('#team-list');
    this.teams = new Teams();
    this.teams.on('reset', this.displayTeamList, this);
    this.teams.on('add', this.displayTeamItem, this);
    this.teams.on('add', this.render, this);
    this.teams.fetch({reset: true});
  },
  events: {
    'click #team-new': 'displayTeamCreateModal',
    'click #team-add': 'createTeam'
  },
  render: function() {
    this.displayTeamChosen();
  },
  displayTeamChosen: function() {
    this.$teamchosen.html($('#team-' + this.teamid).data('name'));
  },
  displayTeamList: function() {
    if (this.teams.length != 0) {
      this.$teamlist.append('<li class="divider"></li>');
      this.teams.each(this.displayTeamItem);
    }
  },
  displayTeamItem: function(team) {
    var view = new TeamItemView({model: team});
    view.render();
  },
  displayTeamCreateModal: function() {
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
        console.log(res);
        if (res.result == "error") {
          alert(res.msg.message);
        } else {
          self.$modal.hide();
          location.href = '#team-' + team.get('id');
        }
      },
      error: function(model, xhr, options) {
        console.log(xhr);
      }
    });
  }
});

module.exports = TeamView;