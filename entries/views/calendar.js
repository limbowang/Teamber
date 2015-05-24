var tplCalendar = require('../templates/board/calendar/board.handlebars');

var CalendarView = Backbone.View.extend({
  el: '#board',
  render: function() {
    var html = tplCalendar();
    this.$el.html(html);
    this.$calendar = $('#calendar .content');
    this.$calendar.calendar({
      tmpl_path: '/templates/calendar/',
      day: '2013-03-12',
      events_source: '/users/own/calendar'
    });
  }
});

module.exports = CalendarView;