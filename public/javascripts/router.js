define([
  'jquery',
  'underscore',
  'backbone',
  'views/header',
  'views/team/list',
  'views/proj/list'
], function($, _, Backbone, HeaderView, TeamListView, ProjListView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Default
      '*actions': 'defaultAction',
    }
  });

  var init = function(){
    // init views
    new HeaderView();
    new TeamListView();
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