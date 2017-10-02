'use strict';

const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const sanitizeHtmlNoTagsConfig = {
  allowedTags: [],
  allowedAttributes: []
};

const siteInfo = mongoose.Schema({
  pageContent: {
    type: String,
    set: (val) => {
      return this.content = sanitizeHtml(val, sanitizeHtmlNoTagsConfig);
    }
  },
  pageTitle: {
    type: String,
    set: (val) => {
      return this.content = sanitizeHtml(val, sanitizeHtmlNoTagsConfig);
    }
  },
  pageType: {
    type: String,
    set: (val) => {
      return this.content = sanitizeHtml(val, sanitizeHtmlNoTagsConfig);
    }
  }
}, {timestamps: true});

module.exports = mongoose.model('SiteInfo', siteInfo);
