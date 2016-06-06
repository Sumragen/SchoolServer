/**
 * Created by trainee on 6/6/16.
 */
var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: './app/config.json' });

module.exports = nconf;