'use strict';
/**
 * @module files
 */

const path = require('path');

const pathToFilesFolder = path.join(__dirname, '..', '..', '..', 'uploads');

/**
 * endpoint for retrieving file
 * @function getSingleFileEndpoint
 * @param {Object} req - the express request object, must contain the key fileName with the name of the file to be sent
 * @param {Object} res - the express response object
 */
function getSingleFileEndpoint(req, res) {
  if (!req.fileName) {
    res.status(404);
    res.json({
      errors: [{
        error: 'no file found',
        status: 404
      }]
    });
  } else {
    const imagePath = `${pathToFilesFolder}/${req.fileName}`;
    res.status(200);
    res.sendFile(imagePath);
  }
}

module.exports = getSingleFileEndpoint;
