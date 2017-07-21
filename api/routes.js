'use strict';

const router = require('express').Router();

const fileRoutes = require('./file/fileRoutes');

router.use('/file', fileRoutes);

module.exports = router;
