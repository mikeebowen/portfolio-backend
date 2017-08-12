'use strict';

const ContentItem = require('../models/ContentItem');

function postContentItem(req, res, next) {
  const contentItem = {
    author: req.body.contentItem.author,
    content: req.body.contentItem.content,
    description: req.body.contentItem.description,
    image: req.body.contentItem.image,
    postType: req.body.contentItem.postType,
    subtitle: req.body.contentItem.subtitle,
    title: req.body.contentItem.title
  };
  
  ContentItem.create(contentItem, (err, newContentItem) => {
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


module.exports = postContentItem;
