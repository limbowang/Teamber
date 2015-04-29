var models = require('../../models');
var utils  = require('../utils');
var chai   = require('chai');
var sinon  = require('sinon');
var q      = require('Q');

var s      = models.sequelize;
var User   = models.User;
var Team   = models.Team;
var expect = chai.expect;
var given  = utils.given;
var clear  = utils.clear;

beforeEach(function(){

  given('User', {
    where: { username: 'creator' },
    defaults: {
      password: 'creator',
      email:    'creator@7.com',
      nickname: 'creator'
    }
  });

  given('User', {
    where: { username: 'member' },
    defaults: {
      password: 'member',
      email:    'member@7.com',
      nickname: 'member'
    }
  });

  clear('Team');
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
        });
    });

    it("cannot create twice with same name", function(done) {
      User
        .find({where: { username: 'creator'}})
        .then(function(user) {
          return Team
            .create({
              name: 'testteam2',
              creator_id: user.id
            })
            .then(function(team) {
              expect(team.name).to.equal('testteam2');
              return team;
            })
            .catch(function(e) {
              doen(e);
            });

        })
        .then(function(team) {
          Team
            .create({
              name: team.name,
              creator_id: team.creator_id
            })
            .catch(function(e) {
              try {
                expect(e.message).to.equal('团队名称已经使用');
              } catch(e) {
                done(e);
              }
              done();
            });
        });
    });
  });

  describe("#add members", function() {
    it('should add a member', function(done) {
      User
        .find({where: { username: 'creator'}})
        .then(function(user) {
          Team
            .findOrCreate({
              where: { name: 'team-addmember' },
              defaults: {
                creator_id: user.id
              }
            })
            .then(function(team) {
              console.log(team.getMember);
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