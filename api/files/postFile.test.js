'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('uploadFile', function () {

  it('should set status to 400 and { error: \'required fields missing\' } when base64String is not included in body', function (done) {
    const fsStub = {
      writeFile: sinon.spy()
    };

    const res = {
      status: sinon.spy(),
      json: sinon.spy()
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
    let uploadFile = proxyquire('./uploadFile', { 'fs': fsStub, 'file-type': fileTypeSub });

    uploadFile(req, res, () => {
    });
    expect(res.json.calledWith({ error: 'required fields missing' })).to.equal(true);
    expect(res.status.calledWith(400)).to.equal(true);
    done();
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
    let uploadFile = proxyquire('./uploadFile', { 'fs': fsStub, 'file-type': fileTypeSub });

    uploadFile(req, res, () => {
    });

    expect(fsStub.writeFile.args[ 0 ][ 0 ]).to.contain('/portfolio-backend/uploads/testName.png');
    expect(fsStub.writeFile.args[ 0 ][ 1 ]).to.deep.equal(testBuffer);
    done();
  });

  it('should call res.json when file is written successfully', function (done) {

    const res = {
      json: sinon.spy()
    };
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
    let uploadFile = proxyquire('./uploadFile', { 'file-type': fileTypeSub });

    uploadFile(req, res);
    setTimeout(() => {
      expect(res.json.called).to.equal(true);
      done();
    }, 100);
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
    let uploadFile = proxyquire('./uploadFile', {
      'file-type': fileTypeSub,
      'local-express-error-handler': expressErrorHandlerSpy,
      'path': pathStub
    });

    uploadFile(req, {});
    setTimeout(() => {
      expect(expressErrorHandlerSpy.called).to.equal(true);
      done();
    }, 100);
  });
});
