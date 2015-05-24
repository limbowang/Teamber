var HeaderView = require('./views/header');
var TeamView = require('./views/team');
var ProjView = require('./views/proj');
var CalendarView = require('./views/calendar');
var MytasksView = require('./views/mytasks');

var Teams = require('./collections/teams');
var Members = require('./collections/members');
var Projs = require('./collections/projs');

var AppRouter = Backbone.Router.extend({
  routes: {
    // Default
    'team-:id': 'showTeam',
    'team-:tid/proj-:id': 'showProj',
    'calendar': 'showCalendar',
    'mytasks': 'showTasks',
    '*actions': 'defaultAction'
  }
});

var init = function(){
  // init collections
  var 
    teams = new Teams(),
    members = new Members(),
    projs = new Projs();

  // init views
  var
    headerView = new HeaderView(),
    teamView = new TeamView({teams: teams, projs: projs, members: members}),
    projView = new ProjView({projs: projs, members: members});

  // init router after team collection reset
  teams.once('reset', function() {
    var router = new AppRouter;

    router.on('route:showTeam', function(id) {
      teamView.teamid = id;
      teamView.render();
      projs.teamid = id;
      projs.fetch({reset: true});
      projView.projid = -1;
    })

    router.on('route:showProj', function(teamid, id) {
      if (teamView.teamid != teamid) {
        teamView.teamid = teamid;
        teamView.renderTeamChosen();
        projs.teamid = teamid;
        projs.fetch({reset: true});
        projs.once('reset', function() {
          if (projView.projid != id) {
            projView.projid = id;
            projView.render();
          }
        });
      } else {
        if (projView.projid != id) {
          projView.projid = id;
          projView.render();
        }
      }
    });

    router.on('route:showCalendar', function() {
      if (teamView.teamid < 0) {
        var teamid = '0';
        teamView.teamid = teamid;
        teamView.renderTeamChosen();
        projView.projs.teamid = teamid;
        projView.projs.fetch({reset: true});
      }
      projView.projid = -1;
      var cal = new CalendarView();
      cal.render();
    })

    router.on('route:showTasks', function() {
      if (teamView.teamid < 0) {
        var teamid = '0';
        teamView.teamid = teamid;
        teamView.renderTeamChosen();
        projView.projs.teamid = teamid;
        projView.projs.fetch({reset: true});
      }
      var mytasks = new MytasksView();
      mytasks.render();
      projView.projid = -1;
    })

    router.on('route:defaultAction', function(actions){
      var teamid = '0';
      if (teamView.teamid != teamid) {
        teamView.teamid = teamid;
        teamView.renderTeamChosen();
        projView.projs.teamid = teamid;
        projView.projs.fetch({reset: true});
      }
      var mytasks = new MytasksView();
      mytasks.render();
      projView.projid = -1;
    });

    // start history
    Backbone.history.start();
  })
};

module.exports = {
  init: init
};