'use strict';
/**
 * @module files
 */

const path = require('path');
const fs = require('fs');
const fileType = require('file-type');

const uploadsFilePath = path.join(__dirname, '..', '..', '..', 'uploads');

/**
 * posts a file to database
 * @function postFile
 * @param {Object} req - the request object, must contain body with a base64 string of the file to be saved with the key: base64String
 * @param {Object} res - the express response object
 * @param {Function} next - the express middleware callback
 */
function postFile(req, res, next) {
  
  if (!req.body.base64String) {
    req.responseData = {
      errors: [{
        error: 'required fields missing',
        status: 400
      }]
    };
    
    next();
  } else {
    const base64String = req.body.base64String.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64String, 'base64');
    const fileExtension = fileType(imageBuffer).ext;
    const fileName = req.body.fileName ? req.body.fileName : `file-${Date.now()}.${fileExtension}`;
    
    fs.writeFile(`${uploadsFilePath}/${fileName}`, imageBuffer, (err) => {
      if (err) {
        next(err);
      } else {
        req.responseData = {
          'data': {
            'type': 'fileInfo',
            'attributes': {
              'name': 'testName.png',
              'message': 'file successfully uploaded',
              'path': `/api/files/${fileName}`
            }
          },
          'status': 201
        };
        next();
      }
    });
    
  }
}

module.exports = postFile;
