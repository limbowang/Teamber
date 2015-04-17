var gulp = require('gulp');
var bower = require('gulp-bower');
var Sequelize = require("sequelize");


gulp.task('default', function() {
  // place code for your default task here
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