'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const ContentItem = require('../models/ContentItem');
const getSingleContentItem = require('./getSingleContentItem');

describe('getSingleContentItem', function () {
  //extend timeout for mockgoose
  this.timeout(120000);
  
  before(function (done) {
    this.timeout(120000);
    
    mockgoose.prepareStorage()
      .then(function () {
        mongoose.connect('mongodb://example.com/TestingDB', function (err) {
          done(err);
        });
      })
      .catch(err => done(err));
  });
  
  it('should return ContentItems corresponding to search query', function (done) {
    const testContent1 = new ContentItem({
      author: 'Joseph Heller',
      content: '<p>test content content</p>',
      description: 'a test content item',
      postType: 'blogPost',
      subtitle: 'a test subtitle',
      title: 'Catch 22'
    });
    const testContent2 = new ContentItem({
      author: 'Kurt Vonnegut',
      content: '<p>test content content</p>',
      description: 'a test content item',
      postType: 'blogPost',
      subtitle: 'a test subtitle',
      title: 'Slaughterhouse 5'
    });
    
    const promiseArray = [testContent1.save(), testContent2.save()];
    
    function errorHandlerStub(err, req, res, next) {
      expect(true).to.equal(true);
      done(err);
    }
    
    // eslint-disable-next-line prefer-const
    let getSingleContentItem = proxyquire('./getSingleContentItem', {'local-express-error-handler': errorHandlerStub});
    
    Promise.all(promiseArray)
      .then((contentItems) => {
        const req = {
          params: {
            uniqueTitle: contentItems[0].uniqueTitle
          }
        };
        const testItem = {
          author: contentItems[0].author,
          content: contentItems[0].content,
          description: contentItems[0].description,
          image: contentItems[0].image,
          postType: contentItems[0].postType,
          subtitle: contentItems[0].subtitle,
          title: contentItems[0].title
        };
        const testResponseData = {
          data: {
            type: 'ContentItem',
            id: contentItems[0]._id.toString(),
            attributes: testItem
          },
          status: 200
        };
        
        getSingleContentItem(req, {}, (err) => {
          expect(JSON.stringify(req.responseData)).to.deep.equal(JSON.stringify(testResponseData));
          done(err);
        });
      })
      .catch(err => done(err));
  });
  
  it('should return a not found error and status 404 when content item is not found', function (done) {
    function errorHandlerStub(err, req, res, next) {
      expect(err).to.not.exist;
      done(err);
    }
    
    // eslint-disable-next-line prefer-const
    let getSingleContentItem = proxyquire('./getSingleContentItem', {'local-express-error-handler': errorHandlerStub});
    const req = {
      params: {
        uniqueTitle: 'not-a-real-title-12345'
      }
    };
    const testError = {
      errors: [{
        error: `sorry we couldn't find ${req.params.uniqueTitle}`,
        status: 404
      }]
    };
    
    getSingleContentItem(req, {}, () => {
      expect(req.responseData).to.deep.equal(testError);
      done();
    });
  });
  
  it('should call the error handler with an error if mongo returns an error', function (done) {
    const testError = 'not a real error';
    const expressErrorHandlerSpy = (err, req, res, next) => {
      expect(err).to.equal(testError);
      expect(req).to.equal(req);
      expect(res).to.equal(res);
      expect(next.called).to.equal(false);
      
      done();
    };
    const nextSpy = sinon.spy();
    const ContentItemStub = {
      findOne: () => {
        return Promise.reject(testError);
      }
    };
    
    // eslint-disable-next-line prefer-const
    let getSingleContentItem = proxyquire('./getSingleContentItem', {
      'local-express-error-handler': expressErrorHandlerSpy,
      '../models/ContentItem': ContentItemStub
    });
    const req = {
      params: {
        uniqueTitle: 'not-a-real-title-12345'
      }
    };
    
    getSingleContentItem(req, {}, nextSpy);
  });
  
  // restoring everything back
  after(function (done) {
    this.timeout(120000);
    mockgoose.prepareStorage()
      .then(() => {
        return mockgoose.helper.reset();
      })
      .then(() => {
        mongoose.connection.close((err) => {
          if (err) done(err);
          done();
        });
      })
      .catch(err => done(err));
  });
});
