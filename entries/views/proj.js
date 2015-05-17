var Projs = require('../collections/projs');
var Proj = require('../models/proj');
var viewTaskboards = require('./taskboards');
var tplProjItem = require('../templates/sidebar/projitem.handlebars');
var tplBoard = require('../templates/board/proj/board.handlebars');
var tplSubProjItem = require('../templates/board/proj/subprojitem.handlebars');
var tplProjAdd = require('../templates/modal/projadd.handlebars');
var tplSubrojAdd = require('../templates/modal/subprojadd.handlebars');

var ProjItemView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    var html = tplProjItem(this.model.toJSON());
    this.$el.html(html);
    return this;
  }
});

var SubProjItemView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    var html = tplSubProjItem(this.model.toJSON());
    this.$el.html(html);
    return this;
  }
});

var ProjView = BaseView.extend({
  projid: -1,
  initialize: function() {
    this.$projlist = $('#proj-list');
    this.projs.on('reset', this.renderProjList, this);
    this.projs.on('add', this.renderProjItem, this);
  },
  events: {
    'click .proj-new': 'renderCreateProjModal',
    'click .subproj-new': 'renderCreateSubprojModal',
    'click #proj-add': 'createProj',
    'click #subproj-add': 'createSubroj'
  },
  render: function() {
    var proj = this.projs.findWhere({id: parseInt(this.projid)});
    if (proj) {
      console.log(proj.toJSON());
      var html = tplBoard(proj.toJSON());
      this.$board.html(html);
      this.subprojs.projid = this.projid;
      this.subprojs.fetch({reset: true});
    } else {
      location.href = '#';
    }
    var html = tplBoard();
    this.$board.html(html);
  },
  renderProjList: function() {
    this.$projlist.html('');
    if (this.projs.length != 0) {
      this.projs.each(this.renderProjItem, this);
    }
  },
  renderProjItem: function(proj) {
    var view = new ProjItemView({model: proj});
    $('#proj-list').append(view.render().el);
  },
  renderCreateProjModal: function() {
    var html = tplProjAdd();
    this.$modal.html(html).show();
  },
  renderCreateSubprojModal: function() {
    var html = tplSubrojAdd();
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
      success: function(proj) { 
        self.$modal.hide();
        location.href = '#team-' + proj.get('team_id') + '/proj-' + proj.get('id'); 
      },
      error: function(model, xhr, options) { console.log(xhr); }
    });
  },
  createSubproj: function() {
    var self = this;
    var name = this.$modal.find('input[name="name"]').val();
    this.projs.create({
      name: name,
      projid: this.subprojs.projid
    }, {
      wait: true,
      success: function(proj) { 
        self.$modal.hide();
        location.href = '#team-' + proj.get('team_id') + '/proj-' + proj.get('id'); 
      },
      error: function(model, xhr, options) { console.log(xhr); }
    });
  }
});

module.exports = ProjView;