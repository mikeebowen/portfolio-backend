'use strict';

const router = require('express').Router();

const postFile = require('./post/postFile');
const postFileEndpoint = require('./post/postFileEndpoint');
const getFile = require('./get/getFile');
const getFileEndPoint = require('./get/getFileEndpoint');

router.route(['/', '/:fileName'])
  .get(getFile, getFileEndPoint)
  .post(postFile, postFileEndpoint);

module.exports = router;

/**
 * @apiName Get File
 * @api {get} /api/file/:fileName get file
 * @apiGroup file
 * @apiVersion 0.0.1
 * @apiParam {String} fileName name of file requested
 * @apiExample Example Usage:
 * https://example.com/api/file/my-image.jpg
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
 *      "name": "testName.png",
 *      "message": "file successfully uploaded",
 *      "path": "/api/file/testName.png"
 *    }
 *  },
 *  "status": 201
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
 * @apiName Post File
 * @api {post} /api/file/ post file
 * @apiGroup file
 * @apiVersion 0.0.1
 * @apiParam {String} base64String base 64 string of the file to be uploaded
 * @apiExample Example Post Request:
 *   {
 *     "base64String": "data:image/png;base64,aGVsbG8gd29ybGQ="
 *   }
 * @apiSuccess {Number} status The http status of the response
 * @apiSuccess {Object} data  Resource object representing file information
 * @apiSuccess {String} data.type The type of data being returned in the resource object
 * @apiSuccess {Object} data.attributes the attributes of the file info
 * @apiSuccess {String} data.attributes.name  The name of the file
 * @apiSuccess {String} data.attributes.message The file's status message
 * @apiSuccess {String} data.attributes.path The path from which the client can retrieve the file
 * @apiSuccessExample {JSON} Example Success Response:
 *   {
 *     "data": {
 *       "type": "fileInfo",
 *       "attributes": {
 *         "name": "testName.png",
 *         "message": "file successfully uploaded",
 *         "path": "/api/file/example-file.png"
 *       }
 *     },
 *     "status": 201
 *   }
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
