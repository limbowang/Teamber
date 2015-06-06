var tplCalendar = require('../templates/board/calendar/board.handlebars');

var CalendarView = Backbone.View.extend({
  el: '#board',
  render: function() {
    var html = tplCalendar();
    this.$el.html(html);
    this.$calendar = $('#calendar .content');
    var calendar = this.$calendar.calendar({
      tmpl_path: '/templates/calendar/',
      day: '2013-03-12',
      events_source: '/users/own/calendar'
    });

    $('.btn-group button[data-calendar-nav]').each(function() {
      var $this = $(this);
      $this.click(function() {
        calendar.navigate($this.data('calendar-nav'));
      });
    });

    $('.btn-group button[data-calendar-view]').each(function() {
      var $this = $(this);
      $this.click(function() {
        calendar.view($this.data('calendar-view'));
      });
    });
  }
});

module.exports = CalendarView;