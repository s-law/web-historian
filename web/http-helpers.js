var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  if (asset === '/') {
    asset = '/index.html';
  }

  // where is this precise module located with __dirname?
  var assetPath = path.join(__dirname, '/public/' + asset);
  fs.readFile(assetPath, function(err, data) {
    // ignore error case for now
    // we have data and want to do something with it

    if (path.extname(assetPath) === '.css') {
      headers['Content-Type'] = 'text/css';
    } else {
      headers['Content-Type'] = 'text/html'; 
    }
    res.writeHead(200, headers);
    res.end(data); 
  });
};

exports.sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

exports.collectData = function(request) {
  var data = "";
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {

  });
};