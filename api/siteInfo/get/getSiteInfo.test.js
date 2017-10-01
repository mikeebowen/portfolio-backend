'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const SiteInfo = require('../models/SiteInfo');
const getSiteInfo = require('./getSiteInfo');

describe('getSiteInfo', function () {
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
  
  it('should return the siteInfo relating to the pageName submitted', function (done) {
    const testContent1 = new SiteInfo({
      pageName: 'homepage',
      siteTitle: 'tacobell',
      pageContent: 'blah blah'
    });
    const testContent2 = new SiteInfo({
      pageName: 'aboutpage',
      siteTitle: 'racecar',
      pageContent: 'blah blah blacksheep'
    });
    
    const promiseArray = [testContent1.save(), testContent2.save()];
    
    Promise.all(promiseArray)
      .then((pageInfos) => {
        const req = {
          query: {
            pageName: 'homepage'
          }
        };
        const testItem = {
          siteTitle: pageInfos[0].siteTitle,
          pageContent: pageInfos[0].pageContent,
          pageName: pageInfos[0].pageName
        };
        const testResponseData = {
          data: {
            type: 'SiteInfo',
            id: pageInfos[0]._id.toString(),
            attributes: testItem
          },
          status: 200
        };
        
        getSiteInfo(req, {}, (err) => {
          expect(JSON.stringify(req.responseData)).to.deep.equal(JSON.stringify(testResponseData));
          done(err);
        });
      })
      .catch(err => done(err));
  });
  
  it('should return a not found error and status 404 when content item is not found', function (done) {
    
    const req = {
      query: {
        pageName: 'not-a-real-page-name'
      }
    };
    const testError = {
      errors: [{
        error: `sorry we couldn't find info for ${req.query.pageName}`,
        status: 404
      }]
    };
    
    getSiteInfo(req, {}, () => {
      expect(req.responseData).to.deep.equal(testError);
      done();
    });
  });
  
  it('should call the next with error if mongo returns an error', function (done) {
    const testError = 'not a real error';
    const nextSpy = sinon.spy();
    const ContentItemStub = {
      findOne: (query, callback) => {
        callback(testError);
      }
    };
    
    // eslint-disable-next-line prefer-const
    let getSiteInfo = proxyquire('./getSiteInfo', {
      '../models/SiteInfo': ContentItemStub
    });
    const req = {
      query: {
        pageName: 'not-a-real-title-12345'
      }
    };
    
    getSiteInfo(req, {}, nextSpy);
    expect(nextSpy.calledWith(testError), 'next not correctly called with error').to.equal(true);
    done();
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
