var Member = Backbone.Model.extend({
  defaults: {
  	name: '',
    nickname: '',
    email: ''
  },
  urlRoot: '/members'
});

module.exports = Member;