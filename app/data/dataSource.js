/**
 * Created by trainee on 6/3/16.
 */
function randomWord(strLengt) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < strLengt; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
function generateRandomUser(role) {
    return {
        id: ++data.user.lastIndex,
        first_name: randomWord(7),
        last_name: randomWord(9),
        username: randomWord(9),
        email: randomWord(4) + '@' + randomWord(5) + '.com',
        password: 'password',
        roles: [role]
    }
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

var data = {};
var p = permissionSet;
var admin = {
    id: 1,
    name: 'admin',
    description: 'admin rights',
    permissions: [p.isTeacher, p.hasAdminRights, p.canViewUsers, p.canEditUser, p.canAddUsers,
        p.canDeleteUsers, p.canViewSchedule, p.canEditSchedule, p.canAddSchedule, p.canDeleteSchedule,
        p.canViewEvents, p.canEditEvents, p.canAddEvents, p.canDeleteEvents]
};
var teacher = {
    id: 2,
    name: 'teacher',
    description: 'teacher rights',
    permissions: [p.isTeacher,
        p.canViewUsers, p.canEditUser, p.canViewSchedule, p.canViewEvents, p.canEditEvents, p.canAddEvents, p.canDeleteEvents]
};
var student = {
    id: 3,
    name: 'student',
    description: 'student rights',
    permissions: [p.canViewUsers,
        p.canEditUser, p.canViewSchedule, p.canViewEvents]
};
var source = {
    user: {
        objects: [
            {
                id: 1,
                first_name: 'Eric',
                last_name: 'Tituashvili',
                username: 'admin',
                email: 'Davidich@smotra.ru',
                password: 'admin',
                roles: [admin]
            },
            {
                id: 2,
                first_name: 'Aleksey',
                last_name: 'Zarrubin',
                username: 'teacher',
                email: 'zarrubin@24auto.ru',
                password: 'teacher',
                roles: [teacher]
            },
            {
                id: 3,
                first_name: 'George',
                last_name: 'Chivchan',
                username: 'student',
                email: 'Gocha@gmail.com',
                password: 'student',
                roles: [student]
            }
        ]
    }
};

function login(response, request) {
    var tempUser = body;
    var result = null;
    //if (_.every(source.user.objects, function (user) {
    //        if (tempUser.username.toLowerCase() === user.username.toLowerCase() || tempUser.username.toLowerCase() === user.email.toLowerCase()) {
    //            if (tempUser.password === user.password) {
    //                result = angular.copy(user);
    //                delete result.password;
    //            } else {
    //                if (!user.password) {
    //                    result = {error: 'User without password. Please, sign in with social network and set your password in profile settings page.'}
    //                } else {
    //                    return true;
    //                }
    //            }
    //            return false;
    //        }
    //        return true;
    //    })) {
    //    result = {error: 'Username or password is incorrect'};
    //}


    response.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*'
    });
    var user = {
        id: 1,
        first_name: 'Eric',
        last_name: 'Tituashvili',
        username: 'admin',
        email: 'Davidich@smotra.ru'
    };
    response.write(JSON.stringify({currentUser: user, sessionToken: 'simple sessionToken'}));
    response.end();
}

exports.login = login;