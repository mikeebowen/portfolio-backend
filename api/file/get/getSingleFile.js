'use strict';
/**
 *@module files
 */
const fs = require('fs');
const path = require('path');

const pathToFilesFolder = path.join(__dirname, '..', '..', '..', 'uploads');

/**
 * method to serve image
 * @function serveImage
 * @param {Object} req - express request object,
 * must contain params object with the key fileName that contains the name of the file found as a string
 * @param {Object} res - express response object
 * @param {Function} next - express callback
 */
function serveImage(req, res, next) {
  
  fs.readdir(pathToFilesFolder, (err, files) => {
    if (err) {
      next(err);
    } else {
      for (const fileName of files) {
        if (req.params.fileName === fileName) req.fileName = fileName;
      }
      next();
    }
  });
}

module.exports = serveImage;
