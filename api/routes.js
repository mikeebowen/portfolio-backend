'use strict';

const router = require('express').Router();

const fileRoutes = require('./files/fileRoutes');

router.use('/files', fileRoutes);

module.exports = router;
