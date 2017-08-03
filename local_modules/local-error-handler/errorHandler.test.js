'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const path = require('path');

describe('errorHandler', function () {
  let env;

  before(function (done) {
    // prevent contamination of environment variables
    env = process.env;
    done();
  });

  it('should send error to winston when NODE_ENV !== \'production\'', function (done) {
    process.env.NODE_ENV = 'development';
    const testError = 'oh no, what happened?';
    const errorStub = sinon.stub();

    //noinspection JSUnusedLocalSymbols
    const winstonStub = {
      Logger: class {
        //noinspection JSUnusedGlobalSymbols
        constructor() {
          this.error = errorStub;
        }
      }
    };
    // eslint-disable-next-line prefer-const
    let errorHandler = proxyquire('./errorHandler', { 'winston': winstonStub });

    errorHandler(testError);
    expect(errorStub.calledWith(testError))
      .to
      .equal(true);
    done();

  });

  it('should send error to winston when NODE_ENV === \'production\'', function (done) {
    process.env.NODE_ENV = 'production';
    const testError = 'test error';
    const errorStub = sinon.stub();

    //noinspection JSUnusedLocalSymbols
    const winstonStub = {
      Logger: class {
        //noinspection JSUnusedGlobalSymbols
        constructor() {
          this.error = errorStub;
        }
      }
    };
    // eslint-disable-next-line prefer-const
    let errorHandler = proxyquire('./errorHandler', { 'winston': winstonStub });

    errorHandler(testError);
    expect(errorStub.calledWith(testError))
      .to
      .equal(true);
    done();

  });

  it('should create the log file if it does not already exist', function (done) {
    const logFilePath = path.join(__dirname, '../../log', 'portfolio.log');
    const testError = 'not enough tacos';
    const fsStub = {
      existsSync: (portFolioFilePath) => {
        expect(portFolioFilePath)
          .to
          .equal(logFilePath);
        return false;
      },
      writeFile: sinon.spy()
    };
    //noinspection JSUnusedLocalSymbols
    const winstonStub = {
      Logger: class {
        //noinspection JSUnusedGlobalSymbols
        constructor() {
          this.error = () => {
          };
        }
      }
    };

    let errorHandler = proxyquire('./errorHandler', { 'fs': fsStub, 'winston': winstonStub });

    errorHandler(testError);

    expect(fsStub.writeFile.called)
      .to
      .equal(true);
    done();
  });

  it('should throw an error if fs.writeFile returns an error', function (done) {
    const logFilePath = path.join(__dirname, '../../log', 'portfolio.log');
    const testError = 'not enough beef';
    //noinspection JSUnusedLocalSymbols
    const winstonStub = {
      Logger: class {
        //noinspection JSUnusedGlobalSymbols
        constructor() {
          this.error = () => {
          };
        }
      },
      error: sinon.spy()
    };
    const fsStub = {
      existsSync: (portFolioFilePath) => {
        expect(portFolioFilePath)
          .to
          .equal(logFilePath);
        return false;
      },
      writeFile: (filePath, data, callback) => {
        callback(testError);
      }
    };

    let errorHandler = proxyquire('./errorHandler', { 'fs': fsStub, 'winston': winstonStub });

    errorHandler(testError);

    expect(winstonStub.error.calledWith(testError))
      .to
      .equal(true);
    done();
  });

  after((done) => {
    process.env = env;
    done();
  });

});
