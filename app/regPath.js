/**
 * Created by trainee on 6/22/16.
 */
var consts = require('./const.json');
var p = consts.permissionSet;

//don't need session
var unsafePath = {
    '/api/login': ['POST', 'OPTIONS'],
    '/api/logout': ['POST']
};

//need permissions
var authorizationPath = {
    '/api/users': {
        method: ['GET'],
        permissions: [p.canViewUsers]
    },
    '/api/stages': {
        method: ['GET'],
        permissions: [p.canViewStages]
    }
};
var registered = {
    "unsafePath" : unsafePath,
    "authorizationPath" : authorizationPath
};
exports.registered = registered;