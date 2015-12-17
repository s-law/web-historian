// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archiveHelpers = require('../helpers/archive-helpers');

archiveHelpers.readListOfUrls(function(array) {
  archiveHelpers.downloadUrls(array);
});