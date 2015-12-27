var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, statusCode, callback) {
  if (asset === '/') {
    asset = '/public/index.html';
    statusCode = 200;
  } else if (asset.indexOf('/public/') === asset.indexOf('/archives/')) {
    // this is only true when both equal -1; in other words, only
    // when trying to load the stylesheet etc. for our visitors
    asset = '/public/' + asset;
    statusCode = 200;
  }

  // where is this precise module located with __dirname?
  var assetPath = path.join(__dirname, asset);
  fs.readFile(assetPath, function(err, data) {
    // ignore error case for now
    // we have data and want to do something with it

    if (path.extname(assetPath) === '.css') {
      headers['Content-Type'] = 'text/css';
    } else {
      headers['Content-Type'] = 'text/html'; 
    }
    // res.writeHead(statusCode, headers);
    // res.end(data); 
    exports.sendResponse(res, data, statusCode);
  });
};

exports.sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(data);
};

exports.collectData = function(request, response, callback) {
  var target = "";
  request.on('data', function(chunk) {
    target += chunk;
  });
  request.on('end', function() {
    target = target.substr(4);
    callback(target, response);
  });
};

exports.processData = function(target, response) {
  archive.isUrlInList(target)
  .then(function(inList) {
    if (!inList) {
      archive.addUrlToList(target)
      .then(function() {
        exports.serveAssets(response, '/public/loading.html', 302);
      });
    } else {
      archive.isUrlArchived(target)
      .then(function(inArchive) {
        if (inArchive) {
          exports.serveAssets(response, '../archives/sites/'+target, 200);
        } else {
          exports.serveAssets(response, '/public/loading.html', 302);
        }
      });
    }
  });

  // Continuous passing style
  // archive.isUrlInList(target, function(inList) {
  //   if(!inList) {
  //     archive.addUrlToList(target, function() {
  //       exports.serveAssets(response, '/public/loading.html', 302);
  //     });
  //   } else {
  //     archive.isUrlArchived(target, function(inArchive) {
  //       if(!inArchive) {
  //         exports.serveAssets(response, '../public/loading.html', 302);
  //       } else {
  //         exports.serveAssets(response, '../archives/sites/'+target, 200);
  //       }
  //     });
  //   }
  // });
}
