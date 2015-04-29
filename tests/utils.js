var models = require('../models');
var s      = models.sequelize;

var utils = {};

utils.given = function(model, attrs) {
	if (!models.hasOwnProperty(model)) {
		throw new Error("Model " + model + " is not found. Please check if the model name is correct.");
	}

	models[model]
		.findOrCreate(attrs)
		.then(function() {

		})
		.catch(function(e) {
			console.log(e);
		});
}

utils.destroy = function(model, attrs) {
	if (!models.hasOwnProperty(model)) {
		throw new Error("Model " + model + " is not found. Please check if the model name is correct.");
	}

	models[model]
		.destroy(attrs)
		.then(function() {

		})
		.catch(function(e) {
			console.log(e);
		});

}

utils.clear = function(model) {
	if (!models.hasOwnProperty(model)) {
		throw new Error("Model " + model + " is not found. Please check if the model name is correct.");
	}

	s
		.query("delete from " + model + "s;")
		.then(function() {
			
		})
		.catch(function(e) {
			console.log(e);
		});
}

module.exports = utils;