define([
  'jquery',
  'underscore',
  'backbone',
  'views/header',
  'views/sidebar'
], function($, _, Backbone, HeaderView, SidebarView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Default
      '*actions': 'defaultAction',
    }
  });

  var init = function(){
    // init views
    new HeaderView();
    new 

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