'use strict';

const router = require('express').Router();

const postUser = require('./post/postUser');
const jsonEndPoint = require('../endpoints/jsonEndpoint');

router.route('/')
  .post(postUser, jsonEndPoint);

module.exports = router;
