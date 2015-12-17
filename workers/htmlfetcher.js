// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archiveHelpers = require('../helpers/archive-helpers');

archiveHelpers.downloadUrls(['www.google.com', 'www.nytimes.com']);