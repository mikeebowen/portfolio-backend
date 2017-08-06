'use strict';

const ContentItem = require('../models/ContentItem');
const expressErrorHandler = require('local-express-error-handler');

function postContentItem(req, res, next) {
  // const contentItem = _.pick(req.body.contentItem, 'author', 'content', 'description', 'image', 'postType', 'subtitle', 'title');
  const contentItem = {
    author: req.body.contentItem.author,
    content: req.body.contentItem.content,
    description: req.body.contentItem.description,
    image: req.body.contentItem.image,
    postType: req.body.contentItem.postType,
    subtitle: req.body.contentItem.subtitle,
    title: req.body.contentItem.title
  };
  
  ContentItem.create(contentItem)
    .then(newContentItem => {
      req.responseData = {
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
