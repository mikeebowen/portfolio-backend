'use strict';

const router = require('express').Router();
const catchAllEndpoint = require('./endpoints/catchAllEndpoint');

router.get('*', catchAllEndpoint);

module.exports = router;
