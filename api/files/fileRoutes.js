'use strict';

const router = require('express').Router();

const uploadFile = require('./uploadFile');

router.post('/', uploadFile);

module.exports = router;
