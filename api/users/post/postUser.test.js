'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const expect = require('chai').expect;

const postUser = require('./postUser');
const User = require('../models/User');

describe('postUser', function() {

  before(function (done) {
    this.timeout(120000);

    mockgoose.prepareStorage()
      .then(function () {
        mongoose.connect('mongodb://example.com/TestingDB', function (err) {
          done(err);
        });
      });
  });

  it('should send an invalid parameters message when req.body is missing', function(done) {
    const req = {};

    postUser(req, {}, (error) => {
      expect(error).not.to.exist;
      expect(req.responseData.data.attributes.message).to.equal('request called with invalid parameters');
      expect(req.responseData.status).to.equal(417);
      done();
    });
  });

  it('should send an invalid parameters message when req.body.user is missing', function(done) {
    const req = {
      body: {}
    };

    postUser(req, {}, (error) => {
      expect(error).not.to.exist;
      expect(req.responseData.data.attributes.message).to.equal('request called with invalid parameters');
      expect(req.responseData.status).to.equal(417);
      done();
    });
  });

  it('should send an invalid parameters message when req.body.user.password is missing', function(done) {
    const req = {
      body: {
        user: {
          userName: 'bob',
          email: 'bob@example.com'
        }
      }
    };

    postUser(req, {}, (error) => {
      expect(error).not.to.exist;
      expect(req.responseData.data.attributes.message).to.equal('request called with invalid parameters');
      expect(req.responseData.status).to.equal(417);
      done();
    });
  });

  it('should send an invalid parameters message when req.body.user.userName is missing', function(done) {
    const req = {
      body: {
        user: {
          password: 'tacocat',
          email: 'bob@example.com'
        }
      }
    };

    postUser(req, {}, (error) => {
      expect(error).not.to.exist;
      expect(req.responseData.data.attributes.message).to.equal('request called with invalid parameters');
      expect(req.responseData.status).to.equal(417);
      done();
    });
  });

  it('should send an invalid parameters message when req.body.user.email is missing', function(done) {
    const req = {
      body: {
        user: {
          userName: 'bob',
          password: 'tacocat',
        }
      }
    };

    postUser(req, {}, (error) => {
      expect(error).not.to.exist;
      expect(req.responseData.data.attributes.message).to.equal('request called with invalid parameters');
      expect(req.responseData.status).to.equal(417);
      done();
    });
  });

  it('should send an invalid parameters message if a user with the same userName already exitst', function(done) {
    const testUserToCreate = {
      userName: 'bob',
      password: 'tacocat',
      email: 'bob@example.com'
    };

    User.create(testUserToCreate, (error) => {
      expect(error).not.to.exist;
      const req = {
        body: {
          user: {
            userName: 'bob',
            password: 'tacocat',
            email: 'robert@example.com'
          }
        }
      };

      postUser(req, {}, (error) => {
        expect(error).not.to.exist;
        expect(req.responseData.data.attributes.message)
          .to.equal(`${req.body.user.userName} is already a user name in our database, please try a different user name`);
        done();
      });
    });
  });

  it('should send an invalid parameters message if the a user with the same email already exitst', function(done) {
    const testUserToCreate = {
      userName: 'joe',
      password: 'tacocat',
      email: 'joseph@example.com'
    };

    User.create(testUserToCreate, (error) => {
      expect(error).not.to.exist;
      const req = {
        body: {
          user: {
            userName: 'joseph',
            password: 'tacocat',
            email: 'joseph@example.com'
          }
        }
      };

      postUser(req, {}, (error) => {
        expect(error).not.to.exist;
        expect(req.responseData.data.attributes.message)
          .to.equal(`${req.body.user.userName} is already a user name in our database, please try a different user name`);
        done();
      });
    });
  });

  it('should save a new user if all parameters are valid and no user with the same userName or email already exists', function(done) {
    const testUserToCreate = {
      userName: 'jorge',
      password: 'tacocat',
      email: 'jorge@example.com'
    };

    const req = {
      body: {
        user: testUserToCreate
      }
    };

    postUser(req, {}, (error) => {
      expect(error).not.to.exist;
      expect(req.responseData.data.attributes.message).to.equal(`New user: ${req.body.user.userName} has been created`);
      done();
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
