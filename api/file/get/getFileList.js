'use strict';

const fs = require('fs');
const path = require('path');

const pathToFilesFolder = path.join(__dirname, '..', '..', '..', 'uploads');

function getFileList(req, res, next) {
  
  fs.readdir(pathToFilesFolder, (err, fileNames) => {
    if (err) {
      next(err);
    } else {
      req.responseData = {data: null, status: 200};
      req.responseData.data = fileNames.map((fileName) => {
        return {
          type: 'fileInfo',
          attributes: {
            name: fileName,
            location: `/api/files/${fileName}`
          }
        };
      });
      
      next();
    }
  });
}

module.exports = getFileList;
