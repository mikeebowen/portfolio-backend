'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const ContentItem = require('../models/ContentItem');
const getContentItems = require('./getContentItems');

describe('getContentItems', function () {
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
  
  afterEach(function (done) {
    mockgoose.helper.reset().then(() => {
      done();
    });
  });
  
  it('should all return all items if no query parameters are provided', function (done) {
    const testContent1 = new ContentItem({
      author: 'Joseph Heller taco',
      content: '<p>taco</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Catch 22'
    });
    const testContent2 = new ContentItem({
      author: 'Kurt Vonnegut',
      content: '<p>test content content taco</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Slaughterhouse 5'
    });
    const testContent3 = new ContentItem({
      author: 'Mark Twain',
      content: '<p>test content content</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Huckleberry Finn'
    });
    const testContent4 = new ContentItem({
      author: 'Ernest Hemingway',
      content: '<p>test content content</p>',
      description: 'a great book',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'The Sun Also Rises'
    });
    const testContent5 = new ContentItem({
      author: 'Henry James',
      content: '<p>test content content</p>',
      description: 'a horrible book',
      postType: 'blogPost',
      subtitle: 'a test subtitle',
      title: 'The Portrait of a Lady'
    });
    
    const promiseArray = [testContent1.save(), testContent2.save(), testContent3.save(), testContent4.save(), testContent5.save()];
    const req = {};
    
    Promise.all(promiseArray)
      .then((contentItems) => {
        
        getContentItems(req, {}, (err) => {
          expect(err).not.to.exist;
          expect(req.responseData.length).to.equal(5);
          done();
        });
      })
      .catch(err => done(err));
    
  });
  
  it('should all return all items sorted by relevance if req.query.q is provided, but req.query.limit is not provided', function (done) {
    const testContent1 = new ContentItem({
      author: 'Joseph Heller taco',
      content: '<p>taco</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Catch 22 taco'
    });
    const testContent2 = new ContentItem({
      author: 'Kurt Vonnegut',
      content: '<p>test content content taco</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Slaughterhouse 5'
    });
    const testContent3 = new ContentItem({
      author: 'Mark Twain',
      content: '<p>test content content</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Huckleberry Finn'
    });
    const testContent4 = new ContentItem({
      author: 'Ernest Hemingway',
      content: '<p>test content content</p>',
      description: 'a great book',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'The Sun Also Rises'
    });
    const testContent5 = new ContentItem({
      author: 'Henry James',
      content: '<p>test content content</p>',
      description: 'a horrible book',
      postType: 'blogPost',
      subtitle: 'a test subtitle',
      title: 'The Portrait of a Lady'
    });
    
    const promiseArray = [testContent3.save(), testContent2.save(), testContent5.save(), testContent4.save(), testContent1.save()];
    const req = {
      query: {
        q: 'taco'
      }
    };
    
    Promise.all(promiseArray)
      .then(() => {
        
        getContentItems(req, {}, (err) => {
          expect(err).not.to.exist;
          expect(req.responseData.length).to.equal(5);
          expect(req.responseData[0].attributes.title).to.equal(testContent1.title);
          expect(req.responseData[1].attributes.title).to.equal(testContent2.title);
          expect(req.responseData[2].attributes.title).to.equal(testContent3.title);
          expect(req.responseData[3].attributes.title).to.equal(testContent4.title);
          expect(req.responseData[4].attributes.title).to.equal(testContent5.title);
          done();
        });
      })
      .catch(err => done(err));
    
  });
  
  it('should the number of content items set in limit and sorted by relevance if req.query.limit and req.query.q are provided', function (done) {
    const testContent1 = new ContentItem({
      author: 'Joseph Heller taco',
      content: '<p>taco</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Catch 22 taco'
    });
    const testContent2 = new ContentItem({
      author: 'Kurt Vonnegut',
      content: '<p>test content content taco</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Slaughterhouse 5'
    });
    const testContent3 = new ContentItem({
      author: 'Mark Twain',
      content: '<p>test content content</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Huckleberry Finn'
    });
    const testContent4 = new ContentItem({
      author: 'Ernest Hemingway',
      content: '<p>test content content</p>',
      description: 'a great book',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'The Sun Also Rises'
    });
    const testContent5 = new ContentItem({
      author: 'Henry James',
      content: '<p>test content content</p>',
      description: 'a horrible book',
      postType: 'blogPost',
      subtitle: 'a test subtitle',
      title: 'The Portrait of a Lady'
    });
    
    const promiseArray = [testContent3.save(), testContent2.save(), testContent5.save(), testContent4.save(), testContent1.save()];
    const req = {
      query: {
        q: 'taco',
        limit: '2'
      }
    };
    
    Promise.all(promiseArray)
      .then(() => {
        
        getContentItems(req, {}, (err) => {
          expect(err).not.to.exist;
          expect(req.responseData.length).to.equal(2);
          expect(req.responseData[0].attributes.title).to.equal(testContent1.title);
          expect(req.responseData[1].attributes.title).to.equal(testContent2.title);
          done();
        });
      })
      .catch(err => done(err));
    
  });
  
  it('should the number of content items set in limit unsorted if req.query.limit is provided, but req.query.q is not provided', function (done) {
    const testContent1 = new ContentItem({
      author: 'Joseph Heller taco',
      content: '<p>taco</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Catch 22 taco'
    });
    const testContent2 = new ContentItem({
      author: 'Kurt Vonnegut',
      content: '<p>test content content taco</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Slaughterhouse 5'
    });
    const testContent3 = new ContentItem({
      author: 'Mark Twain',
      content: '<p>test content content</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Huckleberry Finn'
    });
    const testContent4 = new ContentItem({
      author: 'Ernest Hemingway',
      content: '<p>test content content</p>',
      description: 'a great book',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'The Sun Also Rises'
    });
    const testContent5 = new ContentItem({
      author: 'Henry James',
      content: '<p>test content content</p>',
      description: 'a horrible book',
      postType: 'blogPost',
      subtitle: 'a test subtitle',
      title: 'The Portrait of a Lady'
    });
    
    const promiseArray = [testContent3.save(), testContent2.save(), testContent5.save(), testContent4.save(), testContent1.save()];
    const req = {
      query: {
        limit: '2'
      }
    };
    
    Promise.all(promiseArray)
      .then(() => {
        
        getContentItems(req, {}, (err) => {
          expect(err).not.to.exist;
          expect(req.responseData.length).to.equal(2);
          expect(req.responseData[0].attributes).to.have.own.property('title');
          expect(req.responseData[1].attributes).to.have.own.property('title');
          expect(req.responseData[0].attributes).to.have.own.property('uniqueTitle');
          expect(req.responseData[1].attributes).to.have.own.property('uniqueTitle');
          done();
        });
      })
      .catch(err => done(err));
    
  });
  
  it('should return an error object if no content items are found', function (done) {
    const ContentItemStub = {
      find: (query, callback) => {
        callback(null, []);
      }
    };
    
    // eslint-disable-next-line prefer-const
    let getSingleContentItem = proxyquire('./getContentItems', {
      '../models/ContentItem': ContentItemStub
    });
    const req = {
      query: {
        q: 'pizza'
      }
    };
    
    getSingleContentItem(req, {}, (err) => {
      expect(err).not.to.exist;
      expect(req.responseData).to.deep.equal({
        errors: [{
          error: 'sorry we could not find anything',
          status: 404
        }]
      });
      done();
    });
  });
  
  it('should call the next with error if mongo returns an error', function (done) {
    const testError = 'not enough cow bell';
    const nextSpy = sinon.spy();
    const ContentItemStub = {
      find: (query, callback) => {
        callback(testError);
      }
    };
    
    // eslint-disable-next-line prefer-const
    let getSingleContentItem = proxyquire('./getContentItems', {
      '../models/ContentItem': ContentItemStub
    });
    const req = {
      query: {
        q: 'pizza'
      }
    };
    
    getSingleContentItem(req, {}, nextSpy);
    expect(nextSpy.calledWith(testError), 'next not correctly called with error').to.equal(true);
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
      })
      .catch(err => done(err));
  });
});
