'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const getFileEndpoint = require('./getFileEndpoint');

describe('getFileEndPoint', function () {

  it('should return an JSON error response if req.fileName is not included', function (done) {
    const req = {};
    const res = {
      status: sinon.spy(),
      json: sinon.spy()
    };

    Promise.resolve(getFileEndpoint(req, res))
      .then(() => {
        expect(res.status.calledWith(404))
          .to
          .equal(true);
        expect(res.json.calledWith(sinon.match({
          errors: [{
            error: 'no file found',
            status: 404
          }]
        })))
          .to
          .equal(true);

        done();
      })
      .catch(err => done(err));
  });

  it('should call res.sendFile with the path to the fileName param', function (done) {

    const req = {
      fileName: 'fake-file.png'
    };
    const res = {
      status: sinon.spy(),
      sendFile: sinon.spy()
    };

    Promise.resolve(getFileEndpoint(req, res))
      .then(() => {
        expect(res.status.calledWith(200))
          .to
          .equal(true);
        expect(res.sendFile.calledWith(`/something/${req.fileName}`));
        done();
      })
      .catch(err => done(err));
  });
});
