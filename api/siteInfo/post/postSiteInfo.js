'use strict';

const SiteInfo = require('../models/SiteInfo');

function postSiteInfo(req, res, next) {
  if (!req.body || !req.body.siteInfo) {
    const errorMessage = req.body ? 'post request did not include body.siteInfo' : 'post request did not include body';
    next(new Error(errorMessage));
  } else {
    
    SiteInfo.create(req.body.siteInfo, (err, newSiteInfo) => {
      if (err) {
        next(err);
      } else {
        req.responseData = {
          'data': {
            'type': 'Message',
            'attributes': {
              'message': `${newSiteInfo.pageName} info successfully created`
            }
          },
          'status': 201
        };
        next();
      }
    });
  }
}

module.exports = postSiteInfo;
