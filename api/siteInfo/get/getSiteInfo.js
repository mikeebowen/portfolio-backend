'use strict';

const SiteInfo = require('../models/SiteInfo');

function extractSiteInfoItems(arr) {
  return arr.map(elem => {
    return {
      type: 'SiteInfo',
      id: elem._id.toString(),
      attributes: {
        pageContent: elem.pageContent,
        pageType: elem.pageType,
        pageTitle: elem.pageTitle
      }
    };
  });
}

function getSiteInfo(req, res, next) {
  
  SiteInfo.find({}, (err, siteInfo) => {
    if (err) {
      next(err);
    } else if (siteInfo) {
      const siteInfoTrimmed = extractSiteInfoItems(siteInfo);
      
      req.responseData = {
        data: siteInfoTrimmed,
        status: 200
      };
      
      next();
    } else {
      req.responseData = {
        errors: [{
          error: 'sorry there was an error retrieving the page information',
          status: 404
        }]
      };
      
      next();
    }
  });
}

module.exports = getSiteInfo;
