'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const postContentItemEndpoint = require('./postContentItemEndpoint');

describe('postContentItemEndpoint', () => {

  it('should return 400 status and error message when reqObj is not included', (done) => {
    const res = {
      json: sinon.spy(),
      status: sinon.spy()
    };

    Promise.resolve(postContentItemEndpoint({}, res))
      .then(() => {
        expect(res.status.calledWith(400), 'did not send 400 when missing reqObj')
          .to
          .equal(true);
        expect(res.json.calledWith({
          errors: [{
            error: 'sorry we couldn\'t interpret you\'re request',
            status: 400
          }]
        }), 'did not send error message when missing returnVal')
          .to
          .equal(true);
        done();
      })
      .catch(err => done(err));
  });

  it('should send the returnVal status and returnVal data when included', (done) => {

    const req = {
      reqObj: {
        status: 420,
        data: [{
          state: 'of mind',
          needs: 'tacos'
        }]
      }
    };

    const res = {
      json: sinon.spy(),
      status: sinon.spy()
    };

    Promise.resolve(postContentItemEndpoint(req, res))
      .then(() => {
        expect(res.status.calledWith(420), 'did not set status when returnVal.status was included')
          .to
          .equal(true);
        expect(res.json.calledWith(req.reqObj), 'did not send data when returnVal.data was included ')
          .to
          .equal(true);
        done();
      })
      .catch(err => done(err));
  });

  it('should send the error message and status status when errors are included', (done) => {

    const req = {
      reqObj: {
        status: 444,
        errors: [{
          state: 'of mind',
          needs: 'tacos'
        }]
      }
    };

    const res = {
      json: sinon.spy(),
      status: sinon.spy()
    };

    Promise.resolve(postContentItemEndpoint(req, res))
      .then(() => {
        expect(res.status.calledWith(444), 'did not set status when reqObj.status was included')
          .to
          .equal(true);
        expect(res.json.calledWith(req.reqObj), 'did not send data when reqObj.data was included ')
          .to
          .equal(true);
        done();
      })
      .catch(err => done(err));
  });
});
