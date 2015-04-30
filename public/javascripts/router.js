define([
  'jquery',
  'underscore',
  'backbone',
  'views/header',
  'views/team/add',
  'views/proj/list'
], function($, _, Backbone, HeaderView, TeamAddView, ProjListView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      //team
      'team-new': 'addTeam',

      // Default
      '*actions': 'defaultAction',
    }
  });

  var init = function(){
    // init views
    new HeaderView();
    new TeamAddView();
    new ProjListView();

    // listen to routers
    var router = new AppRouter;

    router.on('defaultAction', function(actions){
      console.log('No route:', actions);
    });

    // start history
    Backbone.history.start({pushState: true});
  };
  return {
    init: init
  };
});