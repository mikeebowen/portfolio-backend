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
    title: item.title,
    createdAt: item.createdAt.toString()
  };
  
  return {
    'type': 'ContentItem',
    'id': item._id.toString(),
    'attributes': contentItem
  };
}

/**
 * function to sort resource objects by the number of instances of a string in their data
 * @function sortResourceObjects
 * @param items {Object[]} an array of resource objects to sort
 * @param query {String} the string to use as a value to sort by
 * @return {Array<Object>} an array of resource objects sorted by the number of occurrences of the query string in each
 */

function sortResourceObjects(items, query) {
  const queryRegEx = new RegExp(query.toLowerCase(), 'g');
  const contentItemsWithQueryScores = [];
  
  items.forEach(item => {
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
    
    if (contentItem.queryScore > 0) contentItemsWithQueryScores.push(contentItem);
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
  
  ContentItem.find({})
    .sort({createdAt: 'desc'})
    .exec((err, contentItems) => {
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
          const index = !isNaN(+req.query.index) ? +req.query.index : 0;
          // const itemsLeft = contentItems.length - index;
          // limit = limit < itemsLeft ? limit : itemsLeft;
          req.responseData = {
            status: 200,
            data: responseData.slice(index, index + limit),
            meta: {
              totalItems: contentItems.length
            }
          };
          next();
        } else {
          req.responseData = {
            status: 200,
            data: responseData,
            meta: {
              totalItems: responseData.length
            }
          };
          next();
        }
      } else {
        req.responseData = {
          data: [],
          meta: {
            totalItems: 0
          }
        };
        
        next();
      }
    });
}

module.exports = getContentItems;
