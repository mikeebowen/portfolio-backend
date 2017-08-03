'use strict';
const _ = require('lodash');

const ContentItem = require('../models/ContentItem');
const expressErrorHandler = require('local-express-error-handler');

function postContentItem(req, res, next) {
  const contentItem = _.pick(req.body.contentItem, 'author', 'content', 'description', 'image', 'postType', 'subtitle', 'title');

  ContentItem.create(contentItem)
    .then(newContentItem => {
      req.reqObj = {
        'data': {
          'type': 'Message',
          'attributes': {
            'message': `${newContentItem.title} successfully saved`
          }
        },
        'status': 200
      };
      next();
    })
    .catch(err => expressErrorHandler(err, req, res, next));
}


module.exports = postContentItem;
