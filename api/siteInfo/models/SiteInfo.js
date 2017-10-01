'use strict';

const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const sanitizeHtmlNoTagsConfig = {
  allowedTags: [],
  allowedAttributes: []
};

const siteInfo = mongoose.Schema({
  siteTitle: {
    type: String,
    set: (val) => {
      return this.author = sanitizeHtml(val, sanitizeHtmlNoTagsConfig);
    }
  },
  pageContent: {
    type: String,
    set: (val) => {
      return this.content = sanitizeHtml(val, sanitizeHtmlNoTagsConfig);
    }
  },
  pageName: {
    type: String,
    set: (val) => {
      return this.content = sanitizeHtml(val, sanitizeHtmlNoTagsConfig);
    }
  }
}, {timestamps: true});

module.exports = mongoose.model('SiteInfo', siteInfo);
