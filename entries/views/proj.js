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
    // this.projs = new Projs();
    this.projs.on('reset', this.renderProjList, this);
    this.projs.on('add', this.renderProjItem, this);
  },
  events: {
    'click .proj-new': 'renderCreateProjModal',
    'click #proj-add': 'createProj'
  },
  render: function() {
  },
  renderProjList: function() {
    this.$projlist.html('');
    if (this.projs.length != 0) {
      this.projs.each(this.renderProjItem);
    }
  },
  renderProjItem: function(proj) {
    var view = new ProjItemView({model: proj});
    view.render();
  },
  renderCreateProjModal: function() {
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
      success: function() { self.$modal.hide(); },
      error: function(model, xhr, options) { console.log(xhr); }
    });
  }
});

module.exports = ProjView;