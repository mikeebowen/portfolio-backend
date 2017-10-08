'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const expect = require('chai').expect;

const User = require('./User');

describe('User Schema', () => {

  before(function (done) {
    this.timeout(120000);

    mockgoose.prepareStorage()
      .then(function () {
        mongoose.connect('mongodb://example.com/TestingDB', function (err) {
          done(err);
        });
      });
  });

  it('should require a userName', (done) => {
    const testUser = new User();
    testUser.save((err) => {
      expect(err.name).to.equal('ValidationError');
      done();
    });
  });

  it('should salt a password', (done) => {
    
    User.create({
      userName: 'frodo',
      password: 'tacocat',
      email: 'bob@tacos.com'
    }, (error, testUser) => {
      expect(error).to.not.exist;
      expect(testUser.userName).to.equal('frodo');
      testUser.checkPassword('tacocat', (err, passwordIsValid) => {
        if (err) done(err);
        expect(passwordIsValid).to.equal(true);
        done();
      });
    });

  });

  // restoring everything back
  after(function (done) {
    this.timeout(120000);
    mockgoose.prepareStorage()
      .then(() => {
        mockgoose.helper.reset()
          .then(() => {
            mongoose.connection.close((err) => {
              if (err) done(err);
              done();
            });
          })
          .catch(err => done(err));
      });
  });
});
