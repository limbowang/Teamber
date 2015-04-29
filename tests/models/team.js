var models = require('../../models');
var chai   = require('chai');
var sinon  = require('sinon');
var q      = require('Q');

var s      = models.sequelize;
var User   = models.User;
var Team   = models.Team;
var expect = chai.expect;

var userId = 70;

beforeEach(function(done){
  User
    .findOrCreate({
      where: { username: 'creator' },
      defaults: {
        password: 'creator',
        email:    'creator@7.com',
        nickname: 'creator'
      }
    })
    .then(done)
    .catch(done);

  User
    .findOrCreate({
      where: { username: 'member' },
      defaults: {
        password: 'member',
        email:    'member@7.com',
        nickname: 'member'
      }
    })
    .then(done)
    .catch(done);

  s.query('delete from Teams;')
    .then(done)
    .catch(function(e){
      done(e);
    });
})


describe("team", function() {
  describe("#create", function() {
    it("should create a team", function(done) {
      User
        .find({where: { username: 'creator'}})
        .then(function(user) {
          Team
            .create({
              name: 'testteam',
              creator_id: user.id
            })
            .then(function(team) {
              expect(team.name).to.equal('testteam');
              done();
            })
            .catch(function(e) {
              console.log(e);
              done(e);
            });
        })
    });

    it("cannot create twice with same name", function(done) {
      done();
    });
  });

  describe("#add members", function() {
    it('should add a member', function(done) {
      User
        .find({where: { username: 'creator'}})
        .then(function(user) {
          Team
            .find({where: { name: 'testteam' }})
            .then(function(team) {
              team.addUser(user)
              done();
            })
            .catch(function(e) {
              console.log(e);
              done(e);
            });
        })
        .catch(done);
    });
  });
});