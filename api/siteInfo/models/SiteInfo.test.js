'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const expect = require('chai').expect;

const SiteInfo = require('./SiteInfo');

describe('SiteInfo Model', function () {
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
  
  it('should sanitize values of html', function (done) {
    const testSiteInfo = new SiteInfo({
      siteTitle: '<p>Gulliver\'s Travels</p>',
      pageContent: '<h1>Hola Mundo</h1>',
      pageName: '<div>test page</div>'
    });
  
    testSiteInfo.save((err, item) => {
      expect(err).to.not.exist;
      expect(item.siteTitle).to.equal('Gulliver\'s Travels');
      expect(item.pageContent).to.equal('Hola Mundo');
      expect(item.pageName).to.equal('test page');
      
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
