var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var url = require('url');
// require more modules/folders here!

exports.handleRequest = function(req, res) {
  var headers = httpHelpers.headers;

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  var parsed = url.parse(req.url, true);
  var route = parsed.pathname;

  if (req.method === 'OPTIONS') {
    httpHelpers.sendResponse(res, null);
  } else if (req.method === 'GET') {
    httpHelpers.serveAssets(res, req.url);
  } else if (req.method === 'POST') {
    httpHelpers.collectData(req);
  //   var dataHolder = '';
  //   req.on('data', function(data) {
  //     dataHolder += data;
  //   });

  //   req.on('end', function() {
  //     dataStore.results.push(JSON.parse(dataHolder));

  //     // NOTE: writes are being APPENDED. each write is
  //     // the previously stringified message obj
  //     fs.appendFile(logPath, '\n' + dataHolder, function (err) {});

  //     response.writeHead(201, headers);
  //     response.end();
  //   });
  } else {
    httpHelpers.sendResponse(res, null, 404);
  }
  // res.end(archive.paths.list);
};