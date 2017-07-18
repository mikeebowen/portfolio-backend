'use strict';

const path = require('path');
const fs = require('fs');
const fileType = require('file-type');

const expressErrorHandler = require('local-express-error-handler');

const uploadsFilePath = path.join(__dirname, '..', '..', 'uploads');

function postFile(req, res, next) {

  if (!req.body.base64String) {
    res.status(400);
    res.json({ error: 'required fields missing' });
  } else {
    const base64String = req.body.base64String.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64String, 'base64');
    const fileExtension = fileType(imageBuffer).ext;
    const fileName = req.body.fileName ? req.body.fileName : `file-${Date.now()}.${fileExtension}`;

    fs.writeFile(`${uploadsFilePath}/${fileName}`, imageBuffer, (err, data) => {
      if (err) {
        expressErrorHandler(err, req, res, next);
      } else {
        res.json({ message: 'file saved' });
      }
    });

  }
}

module.exports = postFile;
