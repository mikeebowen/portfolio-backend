'use strict';

/**
 * @module ContentItem
 */

const ContentItem = require('../models/ContentItem');

/**
 * function to extract resource object from ContentItem instance
 * @function extracextractResourceObject
 * @param item {Object} an instance of ConentItem from the database
 * @returns {{type: string, id, attributes: {author, content, description, image, postType, subtitle, uniqueTitle: (*|string|string), title}}}
 */

function extractResourceObject(item) {
  
  const contentItem = {
    author: item.author,
    content: item.content,
    description: item.description,
    image: item.image,
    postType: item.postType,
    subtitle: item.subtitle,
    uniqueTitle: item.uniqueTitle,
    title: item.title
  };
  
  return {
    'type': 'ContentItem',
    'id': item._id,
    'attributes': contentItem
  };
}

/**
 * function to sort resource objects by the number of instances of a string in their data
 * @function sortResourceObjects
 * @param items {Object[]} an array of resource objects to sort
 * @param query {String} the string to use as a value to sort by
 * @return {Array<Object>} an array of resorce objects sorted by the number of occurrences of the query string in each
 */

function sortResourceObjects(items, query) {
  const queryRegEx = new RegExp(query.toLowerCase(), 'g');
  
  const contentItemsWithQueryScores = items.map(item => {
    const contentItem = extractResourceObject(item);
    
    const contentMatches = contentItem.attributes.content ? (contentItem.attributes.content.toLowerCase()
      .match(queryRegEx) || []).length : 0;
    const titleMatches = contentItem.attributes.title ? (contentItem.attributes.title.toLowerCase()
      .match(queryRegEx) || []).length : 0;
    const subtitleMatches = contentItem.attributes.subtitle ? (contentItem.attributes.subtitle.toLowerCase()
      .match(queryRegEx) || []).length : 0;
    const descriptionMatches = contentItem.attributes.description ? (contentItem.attributes.description.toLowerCase()
      .match(queryRegEx) || []).length : 0;
    const authorMatches = contentItem.attributes.author ? (contentItem.attributes.author.toLowerCase()
      .match(queryRegEx) || []).length : 0;
    
    contentItem.queryScore = contentMatches + titleMatches + descriptionMatches + authorMatches + subtitleMatches;
    
    return contentItem;
  });
  
  return contentItemsWithQueryScores.sort((a, b) => {
    return b.queryScore - a.queryScore;
  });
}

/**
 * express middleware to find ContentItem instances
 * @function getContentItems
 * @param req {Object} The express request object
 * @param res {Object} the express response object
 * @param next {Function} the express next callback
 */

function getContentItems(req, res, next) {
  
  ContentItem.find({}, (err, contentItems) => {
    if (err) {
      next(err);
    } else if (contentItems.length) {
      let responseData;
      const limit = req.query ? +req.query.limit : NaN;
      if (req.query && req.query.q) {
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
    } else {
      req.responseData = {
        errors: [{
          error: 'sorry we could not find anything',
          status: 404
        }]
      };
      
      next();
    }
  });
}

module.exports = getContentItems;
