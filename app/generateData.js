/**
 * Created by trainee on 6/7/16.
 */
var faker = require('faker');
var _ = require('lodash');

var libs = process.cwd() + '/app/libs/';

var log = require(libs + 'log')(module);
var db = require(libs + 'db/mongoose');
var config = require(libs + 'config');

var User = require(libs + 'model/user');
var Role = require(libs + 'model/role');
var Client = require(libs + 'model/client');
var AccessToken = require(libs + 'model/accessToken');
var RefreshToken = require(libs + 'model/refreshToken');
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
var admin = {
    name: 'admin',
    description: 'admin rights',
    weight : 90,
    permissions: [p.isTeacher, p.hasAdminRights, p.canViewUsers, p.canEditUser, p.canAddUsers,
        p.canDeleteUsers, p.canViewSchedule, p.canEditSchedule, p.canAddSchedule, p.canDeleteSchedule,
        p.canViewEvents, p.canEditEvents, p.canAddEvents, p.canDeleteEvents]
};
var teacher = {
    name: 'teacher',
    description: 'teacher rights',
    weight : 50,
    permissions: [p.isTeacher,
        p.canViewUsers, p.canEditUser, p.canViewSchedule, p.canViewEvents, p.canEditEvents, p.canAddEvents, p.canDeleteEvents]
};
var student = {
    name: 'student',
    description: 'student rights',
    weight: 10,
    permissions: [p.canViewUsers,
        p.canEditUser, p.canViewSchedule, p.canViewEvents]
};
var roles = [admin, teacher, student];
var source = {
    user: {
        objects: [
            {
                first_name: 'Eric',
                last_name: 'Tituashvili',
                username: 'admin',
                email: 'Davidich@smotra.ru',
                password: 'admin',
                roles: ['admin']
            },
            {
                first_name: 'Aleksey',
                last_name: 'Zarrubin',
                username: 'teacher',
                email: 'zarrubin@24auto.ru',
                password: 'teacher',
                roles: ['teacher']
            },
            {
                first_name: 'George',
                last_name: 'Chivchan',
                username: 'student',
                email: 'Gocha@gmail.com',
                password: 'student',
                roles: ['student']
            }
        ]
    }
};
Role.remove({}, function (err) {
    _.each(roles, function (data) {
        var role = new Role(data);
        role.save(function (err, role) {
            if (!err) {
                log.info("New role - %s", role.name);
            } else {
                return log.error(err);
            }
        })
    })
});
User.remove({}, function (err) {
    Role.find(function (err, roles) {
        _.each(source.user.objects, function (userEntity) {
            var userRoles = _.filter(roles, function (r) {
                return r.name == userEntity.roles[0]
            });
            delete userEntity.roles;
            var user = new User(userEntity);
            user.roles.push(userRoles[0]._id);
            user.save(function (err, data) {
                if (!err) {
                    log.info("New user - %s:%s", data.username, data.password);
                } else {
                    return log.error(err);
                }
            });
        });
    });
});

Client.remove({}, function (err) {
    var client = new Client({
        name: config.get("default:client:name"),
        clientId: config.get("default:client:clientId"),
        clientSecret: config.get("default:client:clientSecret")
    });

    client.save(function (err, client) {
        if (!err) {
            log.info("New client - %s:%s", client.clientId, client.clientSecret);
        } else {
            return log.error(err);
        }

    });
});

AccessToken.remove({}, function (err) {
    if (err) {
        return log.error(err);
    }
});

RefreshToken.remove({}, function (err) {
    if (err) {
        return log.error(err);
    }
});

setTimeout(function () {
    db.disconnect();
}, 3000);