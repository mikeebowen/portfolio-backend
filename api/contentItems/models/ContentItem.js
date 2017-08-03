'use strict';

const mongoose = require('mongoose');

const contentItemSchema = mongoose.Schema({
  author: String,
  content: String,
  description: String,
  image: {
    src: String,
    name: String
  },
  postType: String,
  subtitle: String,
  title: {
    type: String,
    required: true
  },
  uniqueTitleKey: {
    type: String,
    default: Date.now()
      .toString()
  }
});

contentItemSchema.virtual('uniqueTitle')
  .get(function () {
    return `${this.title.toLowerCase()
      .toString()
      .replace(/[^a-z0-9+]+/gi, '-')}-${this.uniqueTitleKey}`;
  });

module.exports = mongoose.model('ContentItem', contentItemSchema);
