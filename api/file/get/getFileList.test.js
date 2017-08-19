'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const fs = require('fs');

const getFileList = require('./getFileList');

describe('getFileList', function () {
  let fsStub;
  
  beforeEach(function (done) {
    fsStub = sinon.stub(fs, 'readdir');
    done();
  });
  
  afterEach(function (done) {
    fsStub.restore();
    done();
  });
  
  it('should return a list of file objects', function (done) {
    const fakeFileList = ['notReal.jpg', 'alsoNotReal.png', 'thisIsntRealEither.gif'];
    fsStub.yields(null, fakeFileList);
    
    const returnDataComparison = [
      {
        type: 'fileInfo',
        attributes: {
          name: 'notReal.jpg',
          location: '/api/files/notReal.jpg'
        }
      },
      {
        type: 'fileInfo',
        attributes: {
          name: 'alsoNotReal.png',
          location: '/api/files/alsoNotReal.png'
        }
      },
      {
        type: 'fileInfo',
        attributes: {
          name: 'thisIsntRealEither.gif',
          location: '/api/files/thisIsntRealEither.gif'
        }
      }
    ];
    
    const req = {};
    
    getFileList(req, {}, (err) => {
      expect(err).not.to.exist;
      expect(req.responseData.data).to.deep.equal(returnDataComparison);
      done(err);
    });
  });
  
  it('should call next with error when it receives an error', function (done) {
    const fakeError = {status: 420, message: 'no bacon'};
    fsStub.yields(fakeError);
    
    getFileList({}, {}, (err) => {
      expect(err).to.deep.equal(fakeError);
      done();
    });
  });
});
