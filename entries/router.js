var HeaderView = require('./views/header');
var TeamView = require('./views/team');
var ProjView = require('./views/proj');

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
  // init views
  var
    headerView = new HeaderView(),
    teamView = new TeamView(),
    projView = new ProjView();

  // init router after team collection reset
  teamView.teams.once('reset', function() {
    var router = new AppRouter;

    router.on('route:showTeam', function(id) {
      teamView.teamid = id;
      teamView.render();
      projView.projs.teamid = id;
      projView.projs.fetch({reset: true});
    });

    router.on('route:showProj', function(id) {
      teamView.teamid = id;
      teamView.render();
    });

    router.on('route:defaultAction', function(actions){
      var teamid = 0;
      if (teamView.teamid != teamid) {
        teamView.teamid = teamid;
        teamView.displayTeamChosen();
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