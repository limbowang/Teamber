require(['jquery', 'bootstrap'], function($, b) {
	$('#btn-signout').on('click', function() {
		$('#form-signout').submit();
	});
});