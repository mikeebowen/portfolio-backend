'use strict';

const router = require('express').Router();

const fileRoutes = require('./file/fileRoutes');
const contentItemRoutes = require('./contentItems/contentItemsRoutes');
const siteInfoRoutes = require('./siteInfo/siteInfoRoutes');


router.use('/files', fileRoutes);
router.use('/content-items', contentItemRoutes);
router.use('/site-info', siteInfoRoutes);

module.exports = router;
