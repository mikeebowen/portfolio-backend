'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('postFile', function () {

  it('should set status to 400 and { error: \'required fields missing\' } when base64String is not included in body', function (done) {
    const fsStub = {
      writeFile: sinon.spy()
    };

    const req = {
      body: {
        // base64String: 'data:image/png;base64,aGVsbG8gd29ybGQ=',
        fileName: 'testName.png'
      }
    };

    function fileTypeSub() {
      return { ext: '.png' };
    }

    // tslint:disable-next-line:prefer-const
    let postFile = proxyquire('./postFile', { 'fs': fsStub, 'file-type': fileTypeSub });

    postFile(req, {}, () => {
      expect(req.reqObj)
        .to
        .deep
        .equal({
          errors: [{
            error: 'required fields missing',
            status: 400
          }]
        });
      done();
    });
  });

  it('should call writeFile if all fields are provided', function (done) {
    const fsStub = {
      writeFile: sinon.spy()
    };

    const res = {
      json: sinon.spy()
    };
    const req = {
      body: {
        base64String: 'data:image/png;base64,aGVsbG8gd29ybGQ=',
        fileName: 'testName.png'
      }
    };
    const testBuffer = Buffer.from('aGVsbG8gd29ybGQ=', 'base64');

    function fileTypeSub() {
      return { ext: '.png' };
    }

    // tslint:disable-next-line:prefer-const
    let postFile = proxyquire('./postFile', { 'fs': fsStub, 'file-type': fileTypeSub });

    postFile(req, res, () => {
    });

    expect(fsStub.writeFile.args[0][0].toString())
      .to
      .contain('/uploads/testName.png');
    expect(fsStub.writeFile.args[0][1])
      .to
      .deep
      .equal(testBuffer);
    done();
  });

  it('should call set the correct values on req.reqObj when file is written successfully', function (done) {
    const res = {};
    const req = {
      body: {
        base64String: 'data:image/png;base64,aGVsbG8gd29ybGQ=',
        fileName: 'testName.png'
      }
    };

    function fileTypeSub() {
      return { ext: '.png' };
    }

    // tslint:disable-next-line:prefer-const
    let postFile = proxyquire('./postFile', { 'file-type': fileTypeSub });

    postFile(req, res, () => {
      expect(req.reqObj)
        .to
        .deep
        .equal({
          'data': {
            'type': 'fileInfo',
            'attributes': {
              'name': 'testName.png',
              'message': 'file successfully uploaded',
              'path': '/api/file/testName.png'
            }
          },
          'status': 201
        });
      done();
    });
  });

  it('should call the errorHandler when an error is returned', function (done) {

    const req = {
      body: {
        base64String: 'ba',
        fileName: 'testName.png'
      }
    };
    const expressErrorHandlerSpy = sinon.spy();
    const pathStub = {
      join: () => {
        return () => {
        };
      }
    };

    function fileTypeSub() {
      return { ext: '.png' };
    }

    // tslint:disable-next-line:prefer-const
    let postFile = proxyquire('./postFile', {
      'file-type': fileTypeSub,
      'local-express-error-handler': expressErrorHandlerSpy,
      'path': pathStub
    });

    postFile(req, {});
    setTimeout(() => {
      expect(expressErrorHandlerSpy.called)
        .to
        .equal(true);
      done();
    }, 100);
  });
});
