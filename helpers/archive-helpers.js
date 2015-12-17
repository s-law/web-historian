var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public/'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  // Continuous passing style!
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(target, callback) {
  exports.readListOfUrls(function(list) {
    callback(list.indexOf(target) > 0);
  });
};

exports.addUrlToList = function(target, callback) {
  // tacks on to an existing file (if doesn't exist, will generate)
  fs.appendFile(exports.paths.list, '\n' + target, function(err) {
    callback();
  });
};

exports.isUrlArchived = function(target, callback) {
  fs.open(exports.paths.archivedSites + target, 'r', function(err, stats) {
    if (err && err.code=='ENOENT') {
      callback(false);
    }
    callback(true);
  });
};

exports.downloadUrls = function(target) {
};
