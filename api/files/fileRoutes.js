'use strict';

const router = require('express').Router();

const postFile = require('./postFile');
const postFileEndpoint = require('./postFileEndpoint');
const getFile = require('./getFile');
const getFileEndPoint = require('./getFileEndpoint');
// TODO add documentation for file routes
router.route([ '/', '/:fileName' ]).get(getFile, getFileEndPoint).post(postFile, postFileEndpoint);

module.exports = router;
