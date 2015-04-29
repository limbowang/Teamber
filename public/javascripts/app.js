define([
  'jquery',
  'underscore',
  'backbone',
  'router',
], function($, _, Backbone, Router){
  var init = function(){
    Router.init();
  }

  return {
    init: init
  };
});