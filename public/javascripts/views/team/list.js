define([
  'jquery',
  'underscore',
  'backbone',
  'models/team',
  'collections/teams',
  'text!templates/team/add.html',
  'text!templates/team/list.html'
], function($, _, Backbone, Team, Teams, tplAdd, tplList){
  var TeamView = Backbone.View.extend({
    el: $('#team-list'),
    events: {
      'click #team-new': 'showAddModal'
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
          success: function() {
            
          }
        })
      });
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