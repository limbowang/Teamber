var gulp = require('gulp');
var bower = require('gulp-bower');
var Sequelize = require("sequelize");
var compass = require('gulp-compass');
var mocha = require('gulp-mocha');


gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('css', function() {
	gulp.src('./public/sass/*.scss', {base: './public'})
		.pipe(compass({
			config_file: './public/config.rb',
			css: 'stylesheets',
      		sass: 'scss'
		}))
		.pipe(gulp.dest('stylesheets'));
});

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
		.pipe(mocha({reporter: 'mocha-bamboo-reporter'}));
});