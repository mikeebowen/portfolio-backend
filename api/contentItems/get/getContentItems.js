'use strict';

const ContentItem = require('../models/ContentItem');
const expressErrorHandler = require('local-express-error-handler');

function extractResourceObject(item) {
  
  const contentItem = {
    author: item.author,
    content: item.content,
    description: item.description,
    image: item.image,
    postType: item.postType,
    subtitle: item.subtitle,
    title: item.title
  };
  
  return {
    'type': 'ContentItem',
    'id': item._id,
    'attributes': contentItem
  };
}

function sortResourceObjects(items, query) {
  const queryRegEx = new RegExp(query.toLowerCase(), 'g');
  
  const contentItemsWithQueryScores = items.map(item => {
    const contentItem = extractResourceObject(item);
    
    const contentMatches = contentItem.attributes.content ? (contentItem.attributes.content.toLowerCase()
      .match(queryRegEx) || []).length : 0;
    const titleMatches = contentItem.attributes.title ? (contentItem.attributes.title.toLowerCase()
      .match(queryRegEx) || []).length : 0;
    const descriptionMatches = contentItem.attributes.description ? (contentItem.attributes.description.toLowerCase()
      .match(queryRegEx) || []).length : 0;
    const authorMatches = contentItem.attributes.author ? (contentItem.attributes.author.toLowerCase()
      .match(queryRegEx) || []).length : 0;
    
    contentItem.queryScore = contentMatches + titleMatches + descriptionMatches + authorMatches;
    
    return contentItem;
  });
  
  return contentItemsWithQueryScores.sort((a, b) => {
    return b.queryScore - a.queryScore;
  });
}

function getContentItems(req, res, next) {
  
  ContentItem.find()
    .then(contentItems => {
      let responseData;
      const limit = +req.query.limit;
      if (req.query.q) {
        responseData = sortResourceObjects(contentItems, req.query.q);
      } else {
        responseData = contentItems.map(item => {
          return extractResourceObject(item);
        });
      }
      
      if (!isNaN(limit)) {
        req.responseData = responseData.slice(0, Math.ceil(req.query.limit));
        next();
      } else {
        req.responseData = responseData;
        next();
      }
    });
  
}

module.exports = getContentItems;
