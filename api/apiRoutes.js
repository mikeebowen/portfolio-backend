'use strict';

const router = require('express').Router();

const fileRoutes = require('./file/fileRoutes');
const contentItemRoutes = require('./contentItems/contentItemsRoutes');

router.use('/files', fileRoutes);
router.use('/content-items', contentItemRoutes);

module.exports = router;
