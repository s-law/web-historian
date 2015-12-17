var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var url = require('url');
// require more modules/folders here!

exports.handleRequest = function(req, res) {
  var headers = httpHelpers.headers;

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  if (req.method === 'OPTIONS') {
    httpHelpers.sendResponse(res, null);
  } else if (req.method === 'GET') {
    httpHelpers.serveAssets(res, req.url);
  } else if (req.method === 'POST') {
    httpHelpers.collectData(req, res, httpHelpers.processData);
  } else {
    httpHelpers.sendResponse(res, null, 404);
  }
};