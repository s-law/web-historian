// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archiveHelpers = require('../helpers/archive-helpers');
var Promise = require('bluebird');

// archiveHelpers.readListOfUrls(function(array) {
//   archiveHelpers.downloadUrls(array);
// });
archiveHelpers.readListOfUrls()
.then(function(list) {
  archiveHelpers.downloadUrls(list);
});