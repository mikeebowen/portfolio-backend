'use strict';

const ContentItem = require('../models/ContentItem');
const expressErrorHandler = require('local-express-error-handler');

function getSingleContentItem(req, res, next) {
  
  ContentItem.findOne({uniqueTitle: req.params.uniqueTitle})
    .then(contentItem => {
      if (contentItem) {
        
        const item = {
          author: contentItem.author,
          content: contentItem.content,
          description: contentItem.description,
          image: {
            src: contentItem.image.src,
            name: contentItem.image.name
          },
          postType: contentItem.postType,
          subtitle: contentItem.subtitle,
          title: contentItem.title
        };
        
        req.responseData = {
          data: {
            type: 'ContentItem',
            id: contentItem._id.toString(),
            attributes: item
          },
          status: 200
        };
        
        next();
      } else {
        req.responseData = {
          errors: [{
            error: `sorry we couldn't find ${req.params.uniqueTitle}`,
            status: 404
          }]
        };
        
        next();
      }
    })
    .catch(err => expressErrorHandler(err, req, res, next));
}

module.exports = getSingleContentItem;
