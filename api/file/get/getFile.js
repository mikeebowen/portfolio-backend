'use strict';
/**
 *@module files
 */
const fs = require('fs');
const path = require('path');

const expressErrorHandler = require('local-express-error-handler');

const pathToFilesFolder = path.join(__dirname, '..', '..', '..', 'uploads');

/**
 * method to serve image
 * @function serveImage
 * @param {Object} req - express request object, must contain params object with the key fileName that contains the name of the file found as a string
 * @param {Object} res - express response object
 * @param {Function} next - express callback
 */
function serveImage(req, res, next) {
  if (!req.params.fileName) {
    next();
  } else {

    fs.readdir(pathToFilesFolder, (err, files) => {
      /* istanbul ignore if */
      if (err) {
        expressErrorHandler(err, req, res, next);
      } else {
        for (const fileName of files) {
          if (req.params.fileName === fileName) req.fileName = fileName;
        }
        next();
      }
    });
  }
}

module.exports = serveImage;
