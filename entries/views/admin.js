var AdminView = Backbone.View.extend({
  el: 'tr',
  events: {
    'click [data-action="delete"]': 'renderConfirm',
    'click [data-action="confirm"]': 'removeUser',
    'click [data-action="cancel"]': 'renderCancel'
  },
  renderConfirm: function(e) {
    var $btnDelete = $(e.currentTarget);
    var $confirm = $btnDelete.next();
    $btnDelete.addClass('hide');
    $confirm.removeClass('hide');
  },
  renderCancel: function(e) {
    var $btnCancel = $(e.currentTarget);
    var $confirm = $btnCancel.parent();
    var $btnDelete = $confirm.prev();
    $btnDelete.removeClass('hide');
    $confirm.addClass('hide');
  },
  removeUser: function(e) {
    var $btnConfirm = $(e.currentTarget);
    var username = $btnConfirm.parent().data('username');
    $btnConfirm.addClass('btn-disabled').html('删除中');
    Backbone.$.ajax({
      url: '/users/' + username + '/destroy',
      method: 'POST',
      success: function() {
        $btnConfirm.closest('tr').remove();
      }
    })
  }
})

module.exports = AdminView;