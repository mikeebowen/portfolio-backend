'use strict';

const path = require('path');
const fs = require('fs');
const fileType = require('file-type');

const expressErrorHandler = require('local-express-error-handler');

const uploadsFilePath = path.join(__dirname, '..', '..', 'uploads');
// TODO add documentation to postFile function
function postFile(req, res, next) {

  if (!req.body.base64String) {
    req.reqObj = {
      errors: [ {
        error: 'required fields missing',
        status: 400
      } ]
    };

    next();
  } else {
    const base64String = req.body.base64String.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64String, 'base64');
    const fileExtension = fileType(imageBuffer).ext;
    const fileName = req.body.fileName ? req.body.fileName : `file-${Date.now()}.${fileExtension}`;

    fs.writeFile(`${uploadsFilePath}/${fileName}`, imageBuffer, (err) => {
      if (err) {
        expressErrorHandler(err, req, res, next);
      } else {
        req.reqObj = {
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
