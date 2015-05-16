var BaseView = Backbone.View.extend({
  el: '#main',
  constructor: function(collections) {
    var self = this;

    this.$sidebar = $('#sidebar');
    this.$board = $('#board');
    this.$modal = $('#modal');
    this.$modal.on('click', '[data-dismiss="modal"]', function(){ 
      self.$modal.hide();
    });

    this.alertTimeout = null;

    this.alert = function(type, msg) {
      var self =this;
      var delay = 3000;
      var $notification = $('#notification');
      $notification.html('<div class="alert alert-' + type + '">' + msg + '</div>');
      this.alertTimeout = setTimeout(function() {
        clearTimeout(self.alertTimeout);
        $notification.html('');
      }, delay)
    }

    // init collections
    for (var key in collections) {
      this[key] = collections[key];
    }

    Backbone.View.apply(this, arguments);
  }
})

module.exports = BaseView;