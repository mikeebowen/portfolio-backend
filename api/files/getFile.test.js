'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const getFile = require('./getFile');

describe('getFile', function () {

  it('should return an image file if one is found', function (done) {
    const fsStub = {
      readdir: function(path, callback){
        callback(null, ['another-fake-image.jpg', 'test-image.jpg']);
      }
    };
    let getFile = proxyquire('./getFile', {'fs': fsStub});
    const req = {
      params: {
        fileName: 'test-image.jpg'
      }
    };

    getFile(req, {}, (err) => {
      if(err) done(err);
      expect(err).to.not.exist;
      expect(req.fileName).to.equal('test-image.jpg');
      done();
    });
  });

  it('should not set req.fileName when no image is found', function (done) {
    const fsStub = {
      readdir: function(path, callback){
        callback(null, ['another-fake-image.jpg', 'test-image.jpg']);
      }
    };
    let getFile = proxyquire('./getFile', {'fs': fsStub});
    const req = {
      params: {
        fileName: 'test-image-not-in-directory.jpg'
      }
    };
    const res = {};

    getFile(req, res, (err) => {
      if(err) done(err);
      expect(err).to.not.exist;
      expect(req.fileName).to.be.undefined;
      done();
    });
  });

  it('should not set req.fileName when no params are included', function (done) {
    const fsStub = {
      readdir: function(path, callback){
        callback(null, ['another-fake-image.jpg', 'test-image.jpg']);
      }
    };
    let getFile = proxyquire('./getFile', {'fs': fsStub});
    const req = {
      params: {
        // fileName: 'test-image.jpg'
      }
    };
    const res = {};

    getFile(req, res, (err) => {
      if(err) done(err);
      expect(req.fileName).to.be.undefined;
      done();
    });
  });

  it('should call the errorHandler when an error is returned', function (done) {

    const req = {
      params: {
        fileName: 'tuna.js'
      },
      body: {
        base64String: 'ba',
        fileName: 'testName.png'
      }
    };
    const expressErrorHandlerSpy = sinon.spy();
    const pathStub = {
      join: () => {
        return '/fake/path'
      }
    };

    function fileTypeSub() {
      return { ext: '.png' };
    }

    // tslint:disable-next-line:prefer-const
    let getFile = proxyquire('./getFile', {
      'file-type': fileTypeSub,
      'local-express-error-handler': expressErrorHandlerSpy,
      'path': pathStub
    });

    getFile(req, {});
    setTimeout(() => {
      expect(expressErrorHandlerSpy.called).to.equal(true);
      done();
    }, 100);
  });
});