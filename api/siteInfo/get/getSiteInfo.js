'use strict';

const SiteInfo = require('../models/SiteInfo');

function extractSiteInfoItems(arr) {
  return arr.map(elem => {
    return {
      type: 'SiteInfo',
      id: elem._id.toString(),
      attributes: {
        siteTitle: elem.siteTitle,
        pageContent: elem.pageContent,
        pageName: elem.pageName
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
          error: `sorry we couldn't find info for ${req.query.pageName}`,
          status: 404
        }]
      };
      
      next();
    }
  });
}

module.exports = getSiteInfo;
