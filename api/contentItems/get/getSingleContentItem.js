'use strict';

const ContentItem = require('../models/ContentItem');

function getSingleContentItem(req, res, next) {
  
  ContentItem.findOne({uniqueTitle: req.params.uniqueTitle}, (err, contentItem) => {
    if (err) {
      next(err);
    } else if (contentItem) {
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
        uniqueTitle: contentItem.uniqueTitle,
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
  });
}

module.exports = getSingleContentItem;
