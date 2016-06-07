/**
 * Created by trainee on 6/3/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/libs/',
    log = require(libs + 'log')(module),
    UserModel = require(libs + 'model/user');

var defaultHeader = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*'
};
function login(request, response) {
    UserModel.find({username: request.body.username}, function (err, user) {
        if (err) {
            response.writeHead(404, defaultHeader);
            response.write(JSON.stringify(err));
        } else if (user.length <= 0) {
            response.writeHead(404, defaultHeader);
            response.write(JSON.stringify({message:'User not found'}));
        } else if(user[0].checkPassword(request.body.password)){
            response.writeHead(200, defaultHeader);
            response.write(JSON.stringify({currentUser: user[0].getToClient(), sessionToken: 'simple sessionToken'}));
        }else{
            response.writeHead(404, defaultHeader);
            response.write('User not found');
        }
        response.end();
    });
}
var permissionSet = {
    'isTeacher': 0x001,
    'hasAdminRights': 0x002,
    'canViewUsers': 0x003,
    'canEditUser': 0x004,
    'canAddUsers': 0x005,
    'canDeleteUsers': 0x006,
    'canViewSchedule': 0x007,
    'canEditSchedule': 0x008,
    'canAddSchedule': 0x009,
    'canDeleteSchedule': 0x00a,
    'canViewEvents': 0x00b,
    'canEditEvents': 0x00c,
    'canAddEvents': 0x00d,
    'canDeleteEvents': 0x00e
};
var p = permissionSet;
var student = {
    id: 3,
    name: 'student',
    description: 'student rights',
    permissions: [p.canViewUsers,
        p.canEditUser, p.canViewSchedule, p.canViewEvents]
};
var lastIndex = 3;
function register(request, response) {
    var user = new UserModel(request.body);
    user.id = ++lastIndex;
    user.roles = [student];
    //source.user.objects.push(user);
    user.save(function (err) {
        if (!err) {
            log.info('User created!');
            response.writeHead(200, defaultHeader);
            response.write(JSON.stringify(user));
        } else {
            if (err.name == 'ValidationError') {
                response.statusCode = 400;
                response.send({error: 'Validation error'});
            } else {
                response.statusCode = 500;
                response.send({error: 'Server error'});
            }
            log.error('Internal error(%d): %s', response.statusCode, err.message);
        }
        response.end();
    });
}

exports.login = login;
exports.register = register;