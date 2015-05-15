var HeaderView = require('./views/header');
var TeamView = require('./views/team');
var ProjView = require('./views/proj');

var Teams = require('./collections/teams');
var Members = require('./collections/members');
var Projs = require('./collections/projs');

var AppRouter = Backbone.Router.extend({
  routes: {
    // Default
    'team-:id': 'showTeam',
    'proj-:id': 'showProj',
    'subproj-:id': 'showSubProj',
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
    projView = new ProjView({projs: projs});
  console.log(teamView);
  console.log(projView);

  // init router after team collection reset
  teams.once('reset', function() {
    var router = new AppRouter;

    router.on('route:showTeam', function(id) {
      if (teamView.teamid != id) {
        teamView.teamid = id;
        teamView.render();
        projs.teamid = id;
        projs.fetch({reset: true});
      }
    });

    router.on('route:showProj', function(id) {
    });

    router.on('route:defaultAction', function(actions){
      var teamid = '0';
      if (teamView.teamid != teamid) {
        teamView.teamid = teamid;
        teamView.renderTeamChosen();
        projView.projs.teamid = teamid;
        projView.projs.fetch({reset: true});
      }
    });

    // start history
    Backbone.history.start();
  })
};

module.exports = {
  init: init
};