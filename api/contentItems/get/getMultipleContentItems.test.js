'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const sinon = require('sinon');
require('sinon-mongoose');

const ContentItem = require('../models/ContentItem');
const getMultipleContentItems = require('./getMultipleContentItems');

describe('getMultipleContentItems', function () {
  //extend timeout for mockgoose
  this.timeout(120000);
  let testContent1, testContent2, testContent3, testContent4, testContent5;
  
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
  
  beforeEach(function (done) {
    testContent1 = new ContentItem({
      author: 'Joseph Heller taco',
      content: '<p>taco</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Catch 22 taco'
    });
    testContent2 = new ContentItem({
      author: 'Kurt Vonnegut',
      content: '<p>test content content taco</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Slaughterhouse 5'
    });
    testContent3 = new ContentItem({
      author: 'Mark Twain',
      content: '<p>test content content</p>',
      description: 'taco',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'Huckleberry Finn'
    });
    testContent4 = new ContentItem({
      author: 'Ernest Hemingway',
      content: '<p>test content content</p>',
      description: 'a great book',
      postType: 'blogPost',
      subtitle: 'a test subtitle taco',
      title: 'The Sun Also Rises'
    });
    testContent5 = new ContentItem({
      author: 'Henry James',
      content: '<p>test content content</p>',
      description: 'a horrible book',
      postType: 'blogPost',
      subtitle: 'a test subtitle',
      title: 'The Portrait of a Lady'
    });
    
    const promiseArray = [testContent1.save(), testContent2.save(), testContent3.save(), testContent4.save(), testContent5.save()];
    
    Promise.all(promiseArray)
      .then(data => done())
      .catch(err => done(err));
  });
  
  afterEach(function (done) {
    mockgoose.helper.reset().then(() => {
      done();
    });
  });
  
  it('should all return all items if no query parameters are provided', function (done) {
    
    const req = {};
    
    
    getMultipleContentItems(req, {}, (err) => {
      expect(err).not.to.exist;
      expect(req.responseData.data.length).to.equal(5);
      done();
    });
    
  });
  
  it('should return all matching items sorted by relevance if req.query.q is provided, but req.query.limit is not provided', function (done) {
    const req = {
      query: {
        searchTerm: 'taco'
      }
    };
    
    getMultipleContentItems(req, {}, (err) => {
      expect(err).not.to.exist;
      expect(req.responseData.data.length).to.equal(4);
      expect(req.responseData.data[0].attributes.title).to.equal(testContent1.title);
      expect(req.responseData.data[1].attributes.title).to.equal(testContent2.title);
      expect(req.responseData.data[2].attributes.title).to.equal(testContent3.title);
      expect(req.responseData.data[3].attributes.title).to.equal(testContent4.title);
      done();
    });
  });
  
  it('should return the number of content items set in limit, sorted by relevance, if req.query.limit and req.query.q are provided', function (done) {
    const req = {
      query: {
        searchTerm: 'taco',
        limit: '2'
      }
    };
    
    getMultipleContentItems(req, {}, (err) => {
      expect(err).not.to.exist;
      expect(req.responseData.data.length).to.equal(2);
      expect(req.responseData.data[0].attributes.title).to.equal(testContent1.title);
      expect(req.responseData.data[1].attributes.title).to.equal(testContent2.title);
      done();
    });
    
  });
  
  it('should return the number of ContentItems set in the limit (unsorted) if req.query.limit is provided, but req.query.q is not provided', function (done) {
    const req = {
      query: {
        limit: '2'
      }
    };
    
    getMultipleContentItems(req, {}, (err) => {
      expect(err).not.to.exist;
      expect(req.responseData.data.length).to.equal(2);
      expect(req.responseData.data[0].attributes).to.have.own.property('title');
      expect(req.responseData.data[1].attributes).to.have.own.property('title');
      expect(req.responseData.data[0].attributes).to.have.own.property('uniqueTitle');
      expect(req.responseData.data[1].attributes).to.have.own.property('uniqueTitle');
      done();
    });
  });
  
  it('should return an an empty array if no content items are found', function (done) {
    
    const req = {
      query: {
        searchTerm: 'pizza'
      }
    };
    
    getMultipleContentItems(req, {}, (err) => {
      expect(err).not.to.exist;
      expect(req.responseData).to.deep.equal({
        data: [],
        meta: {
          totalItems: 0
        },
        status: 200
      });
      done();
    });
  });
  
  it('should return an empty array if there are no items in the collection', function (done) {
    mockgoose.helper.reset()
      .then(() => {
        const req = {};
        
        getMultipleContentItems(req, {}, (err) => {
          expect(err).to.not.exist;
          expect(req.responseData).to.deep.equal({
            data: [],
            meta: {
              totalItems: 0
            }
          });
          done();
        });
        
      });
    
  });
  
  it('should call next with error if mongo returns an error', function (done) {
    const testError = 'not enough cow bell';
    const nextSpy = sinon.spy();
    sinon.mock(ContentItem)
      .expects('find')
      //eslint-disable-next-line newline-per-chained-call
      .chain('sort').withArgs({createdAt: 'desc'})
      .chain('exec')
      .yields(testError);
    
    const req = {
      query: {
        q: 'pizza'
      }
    };
    
    getMultipleContentItems(req, {}, nextSpy);
    expect(nextSpy.calledWith(testError), 'next not correctly called with error').to.equal(true);
    
    // contentItemMock.resetBehvaior();
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
