'use strict';

const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const sanitizeHtmlNoTagsConfig = {
  allowedTags: [],
  allowedAttributes: []
};
const sanitizeHtmlContent = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
};

const contentItemSchema = mongoose.Schema({
  author: {
    type: String,
    set: (val) => {
      return this.author = sanitizeHtml(val, sanitizeHtmlNoTagsConfig);
    }
  },
  content: {
    type: String,
    set: (val) => {
      return this.content = sanitizeHtml(val, sanitizeHtmlContent);
    }
  },
  description: String,
  image: {
    src: String,
    name: String
  },
  postType: {
    type: String,
    set: (val) => {
      return this.author = sanitizeHtml(val, sanitizeHtmlNoTagsConfig);
    }
  },
  subtitle: {
    type: String,
    set: (val) => {
      return this.author = sanitizeHtml(val, sanitizeHtmlNoTagsConfig);
    }
  },
  title: {
    type: String,
    required: true,
    set: (val) => {
      return this.author = sanitizeHtml(val, sanitizeHtmlNoTagsConfig);
    }
  },
  uniqueTitleKey: {
    type: String,
    default: Date.now().toString()
  },
  uniqueTitle: String
},
  {timestamps: true});

// Define a pre-save method for contentItemSchema
contentItemSchema.pre('save', function (next) {
  this.uniqueTitle = `${this.title.toLowerCase().toString()
    .replace(/[^a-z0-9+]+/gi, '-')}-${this.uniqueTitleKey}`;
  next();
});

module.exports = mongoose.model('ContentItem', contentItemSchema);
