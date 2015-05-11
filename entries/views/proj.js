var Projs = require('../collections/projs');
var Proj = require('../models/proj');
var tplSidebar = require('../templates/sidebar/projlist.handlebars');

var ProjView = BaseView.extend({
  initialize: function() {
    this.$projlist = this.$sidebar.find('.proj-list');
    this.projs = new Projs();
    this.projs.fetch();
  },
  event: {
    'click #proj-new': 'showCreateProjModal',
    'click #proj-add': 'createProj'
  },
  render: function() {
    var htmlSidebar = tplSidebar(this.projs.toJSON());
    this.$projlist.html(htmlSidebar);
  },
  createProj: function() {
    var name = this.modal.find('input[name="name"]').val();
    var description = this.modal.find('input[name="description"]').val();
    this.projs.create(new Proj({name: name, description: description}));
  },
  showCreateProjModal: function() {
    var html = _.template(tplAdd);
    this.modal.html(html).show();
  }
});

module.exports = ProjView;