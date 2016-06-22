/**
 * Created by trainee on 6/22/16.
 */
var sessionControl = require('./sessionControl');
function checkPath(app) {
    app.use(function (req, res, next) {
        console.log('---------------------------------------');
        console.log(req.headerSession.token);
        if (req.method == 'OPTIONS') {
            res.status(200).send({message: 'done'});
        } else {
            sessionControl.checkPath(req, res, next);
        }
    });
}
exports.checkPath = checkPath;