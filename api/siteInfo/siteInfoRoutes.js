'use strict';

const router = require('express').Router();

const getSiteInfo = require('./get/getSiteInfo');
const jsonEndpoint = require('../endpoints/jsonEndpoint');

router.route('/')
  .get(getSiteInfo, jsonEndpoint);


module.exports = router;

/**
 * @apiGroup ContentItem
 * @apiName GET ContentItem
 * @api {get} /api/content-items/:uniqueTitle get ContentItem
 * @apiVersion 0.0.1
 * @apiParam {String} uniqueTitle uniqueTitle of the ContentItem requested
 * @apiExample Example Usage:
 * https://example.com/api/content-items/catch-22-1502569188964
 * @apiSuccess {Number} status The http status of the response
 * @apiSuccess {Object} data  Resource object representing file information
 * @apiSuccess {String} data.type The type of data being returned in the resource object
 * @apiSuccess {String} data.name  The name of the file
 * @apiSuccess {String} data.message The file's status message
 * @apiSuccess {String} data.path The path from which the client can retrieve the file
 * @apiSuccessExample {JSON} Example Success Response:
 * {
 *  "data": {
 *    "type": "fileInfo",
 *    "attributes": {
 *      "author": "Joseph Heller",
 *      "content": "<p>test content content</p>",
 *      "description": "a test content item",
 *      "postType": "blogPost",
 *      "subtitle": "a test subtitle",
 *      "title": "Catch 22"
 *      "uniqueTitle": "catch-22-1502569188964"
 *    }
 *  },
 *  "status": 200
 * }
 * @apiError (Error 400) {JSON} error
 * error message
 * @apiErrorExample {JSON} Error Response:
 * {
 *  "errors": [ {
 *    "error": "required fields missing",
 *    "status": 400
 *  } ]
 * }
 */

/**
 * @apiName POST ContentItem
 * @api {post} /api/content-items post ContentItem
 * @apiGroup ContentItem
 * @apiVersion 0.0.1
 * @apiParam {Object} contentItem the data to create the new ContentItem
 * @apiParam {String} contentItem.title ContentItem title
 * @apiParam {String} [contentItem.author] ContentItem author
 * @apiParam {String} [contentItem.content] ContentItem html content
 * @apiParam {String} [contentItem.description] ContentItem description
 * @apiParam {String} [contentItem.postType] ContentItem post type. This field is meant to be used as a
 * deliminator for different kinds of posts. For example if you had a news site the options could be 'sports', 'weather', and 'politics'
 * @apiParam {String} [contentItem.subtitle] ContentItem subtitle
 * @apiParam {String} [contentItem.title] ContentItem title
 * @apiExample Example Post Request body:
 *   {
 *     "contentItem": {
 *       "title": "a test title",
 *       "author": "Ernest Hemingway",
 *       "content": "<p>hello world</p>",
 *       "subtitle": "an example subtitle",
 *       "description": "an example description",
 *       "image": {
 *                "src": "/api/file/test-image.jpg",
 *                "name": "test image"
 *       },
 *       "postType": "blogPost",
 *     }
 *   }
 * @apiSuccess {Number} status The http status of the response
 * @apiSuccess {Object} data  Resource object representing file information
 * @apiSuccess {String} data.type The type of data being returned in the resource object
 * @apiSuccess {Object} data.attributes the attributes of the file info
 * @apiSuccess {String} data.attributes.message The successfully saved message
 * @apiSuccessExample {JSON} Example Success Response:
 *   {
 *      "data": {
 *        "type": "Message",
 *        "attributes": {
 *          "message": "a test title successfully created"
 *        }
 *      },
 *      "status": 201
 *    }
 * @apiError (Error 400) {JSON} error
 * error message
 * @apiErrorExample {JSON} Error Response:
 * {
 *  "errors": [ {
 *    "error": "sorry we couldn't interpret you're request",
 *    "status": 400
 *  } ]
 * }
 */
