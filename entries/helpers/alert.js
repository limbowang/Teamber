var alert = function(type, msg) {
	var delay = 3000;
  var $notification = $('#notification');
  $notification.html('<div class="alert alert-' + type + '">' + msg + '</div>');
  this.alertTimeout = setTimeout(function() {
    clearTimeout(self.alertTimeout);
    $notification.html('');
  }, delay)
}

module.exports = alert;