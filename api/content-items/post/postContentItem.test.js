'use strict';

const expect = require('chai').expect;

const postContentItem = require('./postContentItem');

describe('postContentItem', function () {
  it('should be a function', function (done) {
    expect(postContentItem).to.exist;
    done();
  });
});