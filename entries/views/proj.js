var Projs = require('../collections/projs');
var Proj = require('../models/proj');
var tplProjItem = require('../templates/sidebar/projitem.handlebars');
var tplSubProjItem = require('../templates/sidebar/subprojitem.handlebars');
var tplAdd = require('../templates/modal/projadd.handlebars');

var ProjItemView = Backbone.View.extend({
  el: '#proj-list',
  render: function() {
    var html = tplProjItem(this.model.toJSON());
    this.$el.append(html);
    return this;
  }
});

var SubProjItemView = Backbone.View.extend({
  el: '#proj-' + this.projId + ' ul',
  render: function() {
    var html = tplSubProjItem(this.model.toJSON());
    this.$el.append(html);
    return this;
  }
});

var ProjView = BaseView.extend({
  initialize: function() {
    this.$projlist = $('#proj-list');
    this.projs = new Projs();
    this.projs.on('reset', this.displayProjList, this);
    this.projs.on('add', this.displayProjItem, this);
  },
  events: {
    'click #proj-new': 'displayCreateProjModal',
    'click #proj-add': 'createProj'
  },
  render: function() {
  },
  displayProjList: function() {
    this.$projlist.html('');
    if (this.projs.length != 0) {
      this.projs.each(this.displayProjItem);
    }
  },
  displayProjItem: function(proj) {
    var view = new ProjItemView({model: proj});
    view.render();
  },
  displayCreateProjModal: function() {
    var html = tplAdd();
    this.$modal.html(html).show();
  },
  createProj: function() {
    var self = this;
    var name = this.$modal.find('input[name="name"]').val();
    this.projs.create({
      name: name,
      teamid: this.projs.teamid
    }, {
      wait: true,
      url: '/projects/create',
      success: function() { self.$modal.hide(); console.log(self.projs) }
    });
  }
});

module.exports = ProjView;