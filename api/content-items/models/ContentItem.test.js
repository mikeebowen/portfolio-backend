// 'use strict';
//
// const mongoose = require('mongoose');
// mongoose.Promise = Promise;
// const Mockgoose = require('mockgoose').Mockgoose;
// const mockgoose = new Mockgoose(mongoose);
// const expect = require('chai').expect;
//
// const ContentItem = require('./ContentItem');
//
// describe('ContentItem Model', function() {
//   //extend timeout for mockgoose
//   this.timeout(120000);
//
//   before(function(done) {
//     this.timeout(120000);
//
//     mockgoose.prepareStorage().then(() => {
//       mongoose.connect('mongodb://example.com/TestingDB', (err) => {
//         done(err);
//       });
//     })
//       .catch(err => done(err));
//   });
//
//   it('should require title', function (done) {
//     const testContentItem = new ContentItem({
//       description: 'the quick brown fox jumped over the lazy brown dog'
//     });
//
//     testContentItem.save((err) => {
//       expect(err).to.exist;
//       expect(err.message).to.equal('ContentItem validation failed: title: Path `title` is required.');
//       done();
//     });
//   });
//
//   it('should create a ContentItem when title is included title', function (done) {
//     const testContentItem = new ContentItem({
//       title: 'Gulliver\'s Travels'
//     });
//
//     testContentItem.save((err, item) => {
//       expect(err).to.not.exist;
//       expect(item.title).to.equal(testContentItem.title);
//       done();
//     });
//   });
//
//   it('should create a ContentItem and set the uniqueTitle', function (done) {
//     const testContentItem = new ContentItem({
//       title: 'Gulliver\'s Travels'
//     });
//
//     testContentItem.save((err, item) => {
//       expect(err).to.not.exist;
//       expect(item.uniqueTitle).to.contain('gulliver-s-travels-');
//       expect(item.uniqueTitle.length).to.equal(32);
//       done();
//     });
//   });
//
//   // restoring everything back
//   after( (done) => {
//     this.timeout(120000);
//
//     mockgoose.prepareStorage()
//       .then(() => {
//         mockgoose.helper.reset().then(() => {
//           mongoose.connection.close(() => {
//             done();
//           })
//             .catch(err => done(err));
//         });
//       });
//   });
// });
'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const expect = require('chai').expect;


describe('HotMealLocation Model', function() {
  //extend timeout for mockgoose
  this.timeout(120000);

  before(function(done) {
    process.env.SOCRATA_DATA_API_KEY = 'fakeApiKey';

    mockgoose.prepareStorage().then(() => {
      mongoose.connect('mongodb://example.com/TestingDB', (err) => {
        if (err) done(err);
        done();
      });
    });
  });

  it('should work', function (done) {
    expect(true).to.equal(true);
    done();
  });
  // restoring everything back
  after( (done) => {

    mockgoose.prepareStorage()
      .then(() => {
        mockgoose.helper.reset().then(() => {
          mongoose.connection.close((err) => {
            if (err) done(err);
            done();
          });
        });
      });
  });
});