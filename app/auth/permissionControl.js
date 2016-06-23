/**
 * Created by trainee on 6/22/16.
 */
var _ = require('lodash'),
    path = require('./../regPath');
function checkPath(req, res, next) {
    if (path.registered.authorizationPath[req.url.split('?')[0]]) {
        req.headerSession.getSession()
            .then(function (session) {
                if (session.user) {
                    if (_.every(path.registered.authorizationPath[req.url.split('?')[0]].permissions, function (perm) {
                            return session.user.roles[0].permissions.indexOf(perm) > -1;
                        })) {
                        next();
                    } else {
                        res.status(403).send({message: 'Access denied'});
                    }
                } else {
                    res.status(401).send({message: 'Please login'});
                }
            });
    } else {
        next();
    }
}
exports.checkPath = checkPath;