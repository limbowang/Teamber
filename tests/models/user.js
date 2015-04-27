var models = require('../../models');
var chai   = require('chai');
var sinon  = require('sinon');

var User   = models.User;
var expect = chai.expect;

beforeEach(function(done){
	User.destroy({where: {username: '123456'}}).then(function() {
		done()
	});
})


describe("user", function() {
	describe("#create", function() {
		it("should create a user", function(done) {
			User
				.create({
					username: '123456',
					password: '123456',
					email:    '123456@7.com',
					nickname: '123456'
				})
				.then(function(user) {
					expect(user.username).to.equal('123456');
					done();
				})
				.catch(function(e) {
					done(e);
				});
		})
	})
});