'use strict';

const _ = require('lodash');

const ContentItem = require('../models/ContentItem');

function getQueryCounts(items, query) {
  const queryRegEx = new RegExp(query.toLowerCase(), 'g');

  return _.map(items, item => {
    const contentMatches = item.content ? (item.content.toLowerCase()
      .match(queryRegEx) || []).length : 0;
    const titleMatches = item.title ? (item.title.toLowerCase()
      .match(queryRegEx) || []).length : 0;
    const descriptionMatches = item.description ? (item.description.toLowerCase()
      .match(queryRegEx) || []).length : 0;
    const authorMatches = item.author ? (item.author.toLowerCase()
      .match(queryRegEx) || []).length : 0;

    item.queryScore = contentMatches + titleMatches + descriptionMatches + authorMatches;

    return item;
  });
}

function getContentItems(req, res, next) {
  if (req.params.uniqueTitleKey) {
    ContentItem.findOne({uniqueTitleKey: req.params.uniqueTitleKey})
      .then(contentItem => {

      })
    next();
  } else {
    ContentItem.find()
      .then(contentItems => {
        if (req.params.q) {

          contentItems = getQueryCounts(contentItems, req.params.q);
        }
      });
  }

}

module.exports = getContentItems;
