var gulp = require('gulp');
var watch = require('gulp-watch')
var bower = require('gulp-bower');
var Sequelize = require("sequelize");
var compass = require('gulp-compass');
var mocha = require('gulp-mocha');
var browserify = require('gulp-browserify');
var browserifyHandlebars = require('browserify-handlebars');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('watch', function() {
  gulp.start('js');
  gulp.start('css');
  watch('./entries/**/*', function() {
    gulp.run('js');
  })
  .on('error', skip);

  watch('./sass/**/*', function() {
    gulp.run('css');
  })
  .on('error', skip);

  function skip(e) {
    e.end();
  }
});

gulp.task('css', function() {
  gulp.src('./sass/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: './public/stylesheets',
      sass: 'sass'
    }))
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('js', function() {
  gulp.src('./entries/main.js')
    .pipe(browserify({
      transform: [browserifyHandlebars],
      insertGlobals : true
    }))
    // .pipe(uglify())
    .pipe(gulp.dest('./public/javascripts'));
})

gulp.task('bower', function() {
  return 
    bower({
      cwd: './public'
    })
    .pipe(gulp.dest('/public'));
});

gulp.task('migrate', function() {
  var env       = process.env.NODE_ENV || "development";
  var config    = require(__dirname + '/config/database.json')[env];
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
  var migrator = sequelize.getMigrator({
    path: __dirname + '/migrations',
  });
  
  migrator
    .migrate({method: 'up'})
    .success(function() {
      console.log("Migrate successfully.");
      process.exit(0);
    })
});

gulp.task('test', function() {
  return gulp.src('tests/**/*.js')
    .pipe(mocha());
});