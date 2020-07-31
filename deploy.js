
var ghpages = require('gh-pages');

function logError(err) {
    console.log(err);
}

ghpages.publish('dist', logError);