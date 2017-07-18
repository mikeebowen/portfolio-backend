'use strict';
/**
 * @module files
 */

/**
 * endpoint for posting files
 * @function hotMealEndPoints
 * @param {Object} req - the express request object
 * @param {Object} res - the express response object
 */

function postFileEndpoint(req, res) {
  const status = req.reqObj && req.reqObj.status ? req.reqObj.status : 400;

  const data = req.reqObj && (req.reqObj.data || req.reqObj.errors) ? req.reqObj : {
    errors: [ {
      error: 'sorry we couldn\'t interpret you\'re request',
      status: 400
    } ]
  };
  res.status(status);
  res.json(data);

}

module.exports = exports = postFileEndpoint;