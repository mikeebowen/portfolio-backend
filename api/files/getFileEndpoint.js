'use strict';

const path = require('path');

const pathToFilesFolder = path.join(__dirname, '..', '..', 'uploads');

function getFileEndpoint(req, res) {
  if(!req.fileName) {
    res.status(404).json({'error': 'no image found'});
  } else {
    const imagePath = `${pathToFilesFolder}/${req.fileName}`;
    res.status(200).sendFile(imagePath);
  }
}

module.exports = getFileEndpoint;
