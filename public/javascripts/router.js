define([
  'jquery',
  'underscore',
  'backbone',
  'views/team/add'
], function($, _, Backbone, TeamAddView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      '/team/new': 'addTeam',

      // Default
      '*actions': 'defaultAction'
    }
  });

  var init = function(){
    var app_router = new AppRouter;
    app_router.on('addTeam', function(){
      var teamAddView = new TeamAddView();
      teamAddView.render();
    });
    app_router.on('defaultAction', function(actions){
      console.log('No route:', actions);
    });
    Backbone.history.start();
  };
  return {
    init: init
  };
});