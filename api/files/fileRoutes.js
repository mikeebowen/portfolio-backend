'use strict';

const router = require('express').Router();

const postFile = require('./postFile');

router.post('/', postFile);

module.exports = router;
