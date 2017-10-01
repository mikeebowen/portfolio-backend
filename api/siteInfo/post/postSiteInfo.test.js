'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const postSiteInfo = require('./postSiteInfo');
const SiteInfo = require('../models/SiteInfo');

describe('postSiteInfo', function () {
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
  
  it('should save a new PageInfo document and ignore extra values and call next', function (done) {
    const testSiteInfo = {
      pageName: 'homepage',
      siteTitle: 'tacobell',
      pageContent: 'blah blah',
      shouldIgnorethis: 'this should be  missing',
      andThis: 'this also should be missing'
    };
    
    const trimmedSiteInfo = {
      pageName: testSiteInfo.pageName,
      siteTitle: testSiteInfo.siteTitle,
      pageContent: testSiteInfo.pageContent,
    };
    
    const req = {
      body: {
        siteInfo: testSiteInfo
      }
    };
    
    postSiteInfo(req, {}, (err) => {
      expect(err).not.to.exist;
      
      expect(req.responseData).to.deep.equal({
        'data': {
          'type': 'Message',
          'attributes': {
            'message': 'homepage info successfully created'
          }
        },
        'status': 201
      });
      
      SiteInfo.findOne({author: testSiteInfo.author}).then(foundContentItem => {
        expect(foundContentItem.pageName).to.equal(trimmedSiteInfo.pageName);
        expect(foundContentItem.siteTitle).to.equal(trimmedSiteInfo.siteTitle);
        expect(foundContentItem.pageContent).to.equal(trimmedSiteInfo.pageContent);
        expect(foundContentItem.shouldIgnorethis).to.not.exist;
        expect(foundContentItem.andThis).to.not.exist;
        
        done();
      })
        .catch(err => done(err));
    });
  });
  
  it('should save a new PageInfo document and sanitize html content then call next', function (done) {
    const testSiteInfo = {
      pageName: '<p>homepage</p>',
      siteTitle: '<div>tacobell</div>',
      pageContent: '<a>blah blah</a>'
    };
    
    const trimmedSiteInfo = {
      pageName: 'homepage',
      siteTitle: 'tacobell',
      pageContent: 'blah blah'
    };
    
    const req = {
      body: {
        siteInfo: testSiteInfo
      }
    };
    
    postSiteInfo(req, {}, (err) => {
      expect(err).not.to.exist;
      
      expect(req.responseData).to.deep.equal({
        'data': {
          'type': 'Message',
          'attributes': {
            'message': 'homepage info successfully created'
          }
        },
        'status': 201
      });
      
      SiteInfo.findOne({pageName: 'homepage'}).then(foundSiteInfo => {
        expect(foundSiteInfo.pageName).to.equal(trimmedSiteInfo.pageName);
        expect(foundSiteInfo.siteTitle).to.equal(trimmedSiteInfo.siteTitle);
        expect(foundSiteInfo.pageContent).to.equal(trimmedSiteInfo.pageContent);
        
        done();
      })
        .catch(err => done(err));
    });
  });
  
  it('should call the next with error if the database returns an error', function (done) {
    const testError = 'no tacos';
    const SiteInfoStub = {
      create: (data, callback) => {
        callback(testError);
      }
    };
    const nextSpy = sinon.spy();
    const testSiteInfo = {};
    const res = {};
    const req = {
      body: {
        siteInfo: testSiteInfo
      }
    };
    
    // eslint-disable-next-line prefer-const
    let postContentItem = proxyquire('./postSiteInfo', {'../models/SiteInfo': SiteInfoStub});
    
    postContentItem(req, res, nextSpy);
    
    expect(nextSpy.called).to.equal(true);
    expect(nextSpy.calledWith(testError)).to.equal(true);
    done();
  });
  
  it('should return an error if req.body is missing', function (done) {
    
    const req = {};
    
    postSiteInfo(req, {}, (err) => {
      expect(err.message).to.equal('post request did not include body');
      done();
    });
  });
  
  it('should return an error if req.body.siteInfo is missing', function (done) {
    
    const req = { body: {} };
    
    postSiteInfo(req, {}, (err) => {
      expect(err.message).to.equal('post request did not include body.siteInfo');
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
