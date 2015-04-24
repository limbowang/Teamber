var models = require('../../models');
var chai   = require('chai');
var sinon  = require('sinon');

var User   = models.User;
var expect = chai.expect

describe("create user", function() {
	var user = User
		.create({
			username: '123456',
			password: '123456',
			email:    '123456@7.com',
			nickname: '123456'
		})
		.then(function(user) {
			expect(user.username).to.equal('123456');
		})
		.catch(function(e) {
			console.log(e);
		});
		expect(user.username).to.equal('123456');
});