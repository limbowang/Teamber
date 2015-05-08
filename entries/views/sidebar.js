define([
  'jquery',
  'hbs',
  'backbone',
  'models/team',
  'models/project',
  'collections/teams',
  'collections/teams',
  'text!templates/sidebar.html'
], function($, hbs, Backbone, Team, Project, Teams, Projects, tplSidebar){
  var SidebarView = Backbone.View.extend({
    el: $('#sidebar'),
    events: {
      'click #team-new': 'showTeamNew',
      'click #proj-new': 'showProjNew'
    },
    initialize: function() {
      var self = this;

      this.$el.addClass('dropdown dropdown-block');
      this.modal = $('#modal');
      this.modal.on('click', '#btn-create', function() {
        var modal = $('#modal');
        var name = modal.find('input[name="name"]').val();
        var description = modal.find('input[name="description"]').val();
        self.teams.create({
          name: name,
          description: description
        }, {
          wait: true,
          success: function() {
            self.modal.hide();
          },
          error: function() {

          }
        })
      });
      // collection
      this.teams = new Teams;
      this.teams.fetch({
        success: function(teams, resp) {
          self.render();
        }
      });
    },
    render: function() {
      var data = {
        cur: '私人项目',
        teams: this.teams
      }
      var html = _.template(tplList)(data);
      this.$el.append(html);
    },
    showAddModal: function() {
      var html = _.template(tplAdd);
      this.modal.html(html).show();
    }
  });
  return TeamView;
});