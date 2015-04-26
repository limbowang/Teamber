var models = require('../../models');
var chai   = require('chai');
var sinon  = require('sinon');

var User   = models.User;
var expect = chai.expect;

describe("user", function() {
	describe("#create", function() {
		it("should create a user", function() {
			User
				.create({
					username: '123456',
					password: '123456',
					email:    '123456@7.com',
					nickname: '123456'
				})
				.then(function(user) {
					expect(user.username).to.equal('1234567');
				})
				.catch(function(e) {
					expect(e).to.be.null;
				});
		})
	})
});