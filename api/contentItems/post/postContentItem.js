'use strict';

const ContentItem = require('../models/ContentItem');

function postContentItem(req, res, next) {
  if (!req.body || !req.body.contentItem) {
    const errorMessage = req.body ? 'post request did not include body.contentItem' : 'post request did not include body';
    next(new Error(errorMessage));
  } else {
    
    ContentItem.create(req.body.contentItem, (err, newContentItem) => {
      if (err) {
        next(err);
      } else {
        req.responseData = {
          'data': {
            'type': 'Message',
            'attributes': {
              'message': `${newContentItem.title} successfully created`
            }
          },
          'status': 201
        };
        next();
      }
    });
  }
}

module.exports = postContentItem;
