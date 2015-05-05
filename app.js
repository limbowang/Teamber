var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');

// import routers
var
  routes = require('./routes/index'),
  users = require('./routes/users'),
  sessions = require('./routes/sessions'),
  teams = require('./routes/teams'),
  projs = require('./routes/projects'),
  subprojs = require('./routes/subprojects'),
  taskboards = require('./routes/taskboards'),
  tasks = require('./routes/tasks'),
  checkitems = require('./routes/checkitems'),
  comments = require('./routes/comments'),
  histories = require('./routes/histories');

// imports utils
var utils = require('./routes/utils');
var loadUser = utils.loadUser;
var loadFlash = utils.loadFlash;
var auth = utils.auth;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', exphbs({defaultLayout: 'layout', extname: '.html'}));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set session
// app.use(cookieParser());
app.set('trust proxy', 1)
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// app.use(require('node-compass')({mode: 'expanded'}));
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', loadFlash);
app.all('*', loadUser);
app.all('*', auth);
app.use('/', routes);
app.use('/users', users);
app.use('/sessions', sessions);
app.use('/teams', teams);
app.use('/projects', projs);
app.use('/subprojects', subprojs);
app.use('/taskboards', taskboards);
app.use('/tasks', tasks);
app.use('/comments', comments);
app.use('/checkitems', checkitems);
app.use('/histories', histories);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      layout: false
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    layout: false
  });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
