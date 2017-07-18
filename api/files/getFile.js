'use strict';

const fs = require('fs');
const path = require('path');

const expressErrorHandler = require('local-express-error-handler');

const pathToFilesFolder = path.join(__dirname, '..', '..', 'uploads');

function serveImage(req, res, next) {
  if(!req.params.fileName) {
    next();
  } else {

    fs.readdir(pathToFilesFolder, (err, files) => {
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