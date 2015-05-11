var HeaderView = require('./views/header');
var TeamView = require('./views/team');

var AppRouter = Backbone.Router.extend({
  routes: {
    // Default
    '*actions': 'defaultAction',
  }
});

var init = function(){
  // init views
  new HeaderView();
  var teamView = new TeamView();

  // listen to routers
  var router = new AppRouter;

  router.on('defaultAction', function(actions){
    console.log('No route:', actions);
  });

  // start history
  Backbone.history.start({pushState: true});
};

module.exports = {
  init: init
};