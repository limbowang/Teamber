var alert = function(type, info) {
	var delay = 3000;
  var $notification = $('#notification');
  var alertTimeout;
  var msg = '';
  console.log(info);
  if (typeof info == "string") {
    msg = info;
  } else if (typeof info == "object") {
    for (var key in info) {
      msg += info[key];
    }
  };

  return function() {
  	$notification.html('<div class="alert alert-' + type + '">' + msg + '</div>');
  	
  	clearTimeout(alertTimeout);
	  alertTimeout = setTimeout(function() {
	    $notification.html('');
	  }, delay);
  }();
}

module.exports = alert;