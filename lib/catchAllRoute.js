'use strict';

const router = require('express').Router();
const catchAllEndpoint = require('./catchAllEndpoint');

router.get('*', catchAllEndpoint);

module.exports = router;
