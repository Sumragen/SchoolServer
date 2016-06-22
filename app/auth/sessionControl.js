/**
 * Created by trainee on 6/22/16.
 */
var path = require('./../regPath'),
    permissionControl = require('./permissionControl');

function checkPath(req, res, next) {
        if (path.registered.unsafePath[req.url]
                && path.registered.unsafePath[req.url].length > 0
                && path.registered.unsafePath[req.url].indexOf(req.method) > -1) {
            next();
        } else {
            permissionControl.checkPath(req, res, next);
        }
}

exports.checkPath = checkPath;