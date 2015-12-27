var http = require('http');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var Promise = require('bluebird');

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

exports.readListOfUrls = function() {
  return new Promise(function(resolve, reject) {
    fs.readFile(exports.paths.list, 'utf8', function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.split('\n'));
      }
    });
  });

  // Continuous passing style
  // fs.readFile(exports.paths.list, 'utf8', function(err, data) {
  //   callback(data.split('\n'));
  // });
};

exports.isUrlInList = function(target) {
  return new Promise(function(resolve, reject) {
    exports.readListOfUrls()
    .then(function(list) {
      resolve(list.indexOf(target) > 0);
    });
  });

  // Continuous passing style
  // exports.readListOfUrls(function(list) {
  //   callback(list.indexOf(target) > 0);
  // });
};

exports.addUrlToList = function(target) {
  return new Promise(function(resolve, reject) {
    fs.appendFile(exports.paths.list, '\n' + target, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  // Continuous passing style
  // tacks on to an existing file (if doesn't exist, will generate)
  // fs.appendFile(exports.paths.list, '\n' + target, function(err) {
  //   callback();
  // });
};

exports.isUrlArchived = function(target) {
  return new Promise(function(resolve, reject) {
    fs.stat(exports.paths.archivedSites + '/' + target, function(err, stat) {
      if (err && err.code === 'ENOENT') {
        resolve(false);
      } else if (err) {
        reject(err); 
      } else {
        resolve(true);
      }
    });
  });

  // Continuous passing style
  // fs.stat(exports.paths.archivedSites + '/' + target, function(err, stat) {
  //   if (err === null) {
  //     callback(true);
  //   } else if (err.code === 'ENOENT') {
  //     callback(false);
  //   }
  // });
};

exports.downloadUrls = function(array) {
  array.forEach(function(target) {
    exports.isUrlArchived(target)
    .then(function(is) {
      if(!is) {
        downloadUrl(target);
      }
    })

    // Continuous passing style
    // exports.isUrlArchived(target, function(result) {
    //   if (!result) {
    //     downloadUrl(target);
    //   }
    // });
  });

  var downloadUrl = function(target) {
    var options = {
      // .host is a property of the object returned by url.parse
      host: target,
      port: 80,
      path: ''
    };

    http.get(options, function(res) {
      var completeData = '';
      res.on('data', function(chunk) {
        completeData += chunk;
      });
      res.on('end', function() {
        fs.writeFile(exports.paths.archivedSites + '/' + target, completeData, function (err) {
          if (err) {
            throw err;
          }
        });
      });
    });    
  };
};
