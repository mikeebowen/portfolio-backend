'use strict';

//noinspection JSUnusedLocalSymbols
function catchAllEndpoint(req, res) {
  res.status(404);
  res.json({
    errors: [{
      title: 'Error 404 : not found',
      error: 'oops we didn\'t find anything',
      status: 404
    }]
  });
}

module.exports = exports = catchAllEndpoint;
