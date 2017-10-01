'use strict';

const SiteInfo = require('../models/SiteInfo');

function getSiteInfo(req, res, next) {
  
  SiteInfo.findOne({pageName: req.query.pageName}, (err, pageInfo) => {
    if (err) {
      next(err);
    } else if (pageInfo) {
      const siteInfo = {
        siteTitle: pageInfo.siteTitle,
        pageContent: pageInfo.pageContent,
        pageName: pageInfo.pageName
      };
      
      req.responseData = {
        data: {
          type: 'SiteInfo',
          id: pageInfo._id.toString(),
          attributes: siteInfo
        },
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
