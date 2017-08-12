'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const postContentItem = require('./postContentItem');
const ContentItem = require('../models/ContentItem');

describe('postContentItem', function () {
//extend timeout for mockgoose
  this.timeout(120000);
  
  before(function (done) {
    this.timeout(120000);
    
    mockgoose.prepareStorage()
      .then(function () {
        mongoose.connect('mongodb://example.com/TestingDB', function (err) {
          done(err);
        });
      });
  });
  
  it('should save a new content item and ignore extra values and call next', function (done) {
    const testContentItem = {
      author: 'Testy Testerson',
      content: '<p>hello world</p>',
      description: 'a test post',
      image: {
        src: '/fakeImage.jpg',
        name: 'testImage'
      },
      postType: 'blogPost',
      title: 'Test Post',
      subtitle: 'a test blog post',
      shouldIgnorethis: 'this should be  missing',
      andThis: 'this also should be missing'
    };
    
    const trimmedContentItem = {
      author: testContentItem.author,
      content: testContentItem.content,
      description: testContentItem.description,
      image: testContentItem.image,
      postType: testContentItem.postType,
      subtitle: testContentItem.subtitle,
      title: testContentItem.title
    };
    
    const req = {
      body: {
        contentItem: testContentItem
      }
    };
    
    postContentItem(req, {}, (err) => {
      expect(err).not.to.exist;
      
      expect(req.responseData).to.deep.equal({
        'data': {
          'type': 'Message',
          'attributes': {
            'message': 'Test Post successfully created'
          }
        },
        'status': 201
      });
      
      ContentItem.findOne({author: testContentItem.author}).then(foundContentItem => {
        expect(foundContentItem.title).to.equal(trimmedContentItem.title);
        expect(foundContentItem.subtitle).to.equal(trimmedContentItem.subtitle);
        expect(foundContentItem.author).to.equal(trimmedContentItem.author);
        expect(foundContentItem.contentItem).to.equal(trimmedContentItem.contentItem);
        expect(foundContentItem.postType).to.equal(trimmedContentItem.postType);
        expect(foundContentItem.description).to.equal(trimmedContentItem.description);
        expect(foundContentItem.image.src).to.deep.equal(trimmedContentItem.image.src);
        expect(foundContentItem.image.name).to.deep.equal(trimmedContentItem.image.name);
        expect(foundContentItem.shouldIgnorethis).to.not.exist;
        expect(foundContentItem.andThis).to.not.exist;
        
        done();
      })
        .catch(err => done(err));
    });
  });
  
  it('should save a new content item with missing values and call next', function (done) {
    const testContentItem2 = {
      title: 'a test title',
      author: 'Ernest Hemingway',
      content: '<p>hello world</p>',
      subtitle: undefined
    };
    
    const req = {
      body: {
        contentItem: testContentItem2
      }
    };
    
    postContentItem(req, {}, (err) => {
      expect(err).not.to.exist;
      
      expect(req.responseData).to.deep.equal({
        'data': {
          'type': 'Message',
          'attributes': {
            'message': 'a test title successfully created'
          }
        },
        'status': 201
      });
      
      ContentItem.findOne({author: testContentItem2.author})
        .then(foundContentItem => {
          expect(foundContentItem.author).to.equal(testContentItem2.author);
          expect(foundContentItem.content).to.equal(testContentItem2.content);
          expect(foundContentItem.title).to.equal(testContentItem2.title);
          expect(foundContentItem.subtitle).to.not.exist;
          done();
        })
        .catch(err => done(err));
    });
  });
  
  it('should call the next with error if the database returns an error', function (done) {
    const testError = 'no tacos';
    const ContentItemStub = {
      create: (data, callback) => {
        callback(testError);
      }
    };
    const nextSpy = sinon.spy();
    const testContentItem = {};
    const res = {};
    const req = {
      body: {
        contentItem: testContentItem
      }
    };
    
    // eslint-disable-next-line prefer-const
    let postContentItem = proxyquire('./postContentItem', {'../models/ContentItem': ContentItemStub});
    
    postContentItem(req, res, nextSpy);
    
    expect(nextSpy.calledWith(testError)).to.equal(true);
    done();
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
