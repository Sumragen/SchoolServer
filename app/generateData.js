/**
 * Created by trainee on 6/7/16.
 */
var faker = require('faker');
var _ = require('lodash');

var libs = process.cwd() + '/app/libs/';

var log = require(libs + 'log')(module);
var db = require(libs + 'db/mongoose');
var config = require(libs + 'config');

// models
var User = require(libs + 'model/user'),
    Role = require(libs + 'model/role'),
    Event = require(libs + 'model/event'),
    Lesson = require(libs + 'model/lesson'),
    Stage = require(libs + 'model/stage'),
    Subject = require(libs + 'model/subject'),
    Client = require(libs + 'model/client'),
    AccessToken = require(libs + 'model/accessToken'),
    RefreshToken = require(libs + 'model/refreshToken');


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
var events = [
    {
        name: 'Rest',
        date: 'February 19, 2016 11:50 AM',
        description: 'first event (test version)',
        address:{
            city: 'Kherson',
            country: 'Ukraine'
        },
        location: {
            latitude: 46.6699334,
            longitude: 32.6169105
        }
    },
    {
        name: "Children's hospital",
        date: 'September 23, 2016 2:30 PM',
        description: 'Medical inspection',
        address:{
            city: 'Kherson',
            country: 'Ukraine'
        },
        location: {
            latitude: 46.6676171,
            longitude: 32.6100075
        }
    },
    {
        name: 'spring ball',
        date: 'April 15, 2016 4:00 PM',
        description: 'spring ball',
        address:{
            city: 'Kherson',
            country: 'Ukraine'
        },
        location: {
            latitude: 46.6716115,
            longitude: 32.6100684
        }
    }
];
var lessons = [
    {
        stage: '1',
        suffix: 'A',
        classroom: 220,
        day: 'Monday',
        order: [1, 3]
    },
    {
        stage: '4',
        suffix: 'A',
        classroom: 305,
        day: 'Tuesday',
        order: [2]
    },
    {
        stage: '2',
        suffix: 'A',
        classroom: 216,
        day: 'Wednesday',
        order: [1]
    },
    {
        stage: '11',
        suffix: 'A',
        classroom: 101,
        day: 'Thursday',
        order: [4]
    },
    {
        stage: '8',
        suffix: 'A',
        classroom: 306,
        day: 'Friday',
        order: [1, 3]
    },
    {
        stage: '2',
        suffix: 'A',
        classroom: 106,
        day: 'Wednesday',
        order: [0, 2]
    },
    {
        stage: '5',
        suffix: 'B',
        classroom: 207,
        day: 'Wednesday',
        order: [1, 2]
    }
];
var stages = [
    {
        stage: 5,
        suffix: 'A',
    },
    {
        stage: 11,
        suffix: 'A',
    },
    {
        stage: 11,
        suffix: 'B',
    },
    {
        stage: 1,
        suffix: 'A',
    },
    {
        stage: 2,
        suffix: 'A',
    },
    {
        stage: 3,
        suffix: 'A',
    },
    {
        stage: 4,
        suffix: 'A',
    },
    {
        stage: 5,
        suffix: 'B',
    },
    {
        stage: 6,
        suffix: 'A',
    },
    {
        stage: 7,
        suffix: 'A',
    },
    {
        stage: 8,
        suffix: 'A',
    },
    {
        stage: 9,
        suffix: 'A',
    },
    {
        stage: 10,
        suffix: 'A',
    }
];
var subjects = [
    {
        name: 'History',
        teachers: [],
        classRooms: [202]
    },
    {
        name: 'Mathematics',
        teachers: [],
        classRooms: [202]
    },
    {
        name: 'Biology',
        teachers: [],
        classRooms: [202]
    },
    {
        name: 'Astronomy',
        teachers: [],
        classRooms: [202]
    },
    {
        name: 'Literature',
        teachers: [],
        classRooms: [202]
    }
];


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
Event.remove({}, function (err) {
    _.each(events, function (data) {
        var event = new Event(data);
        event.save(function (err, event) {
            if (!err) {
                log.info("New event - %s", event.name);
            } else {
                return log.error(err);
            }
        })
    })
});
Lesson.remove({}, function (err) {
    _.each(lessons, function (data) {
        var lesson = new Lesson(data);
        lesson.save(function (err, lesson) {
            if (!err) {
                log.info("New lesson");
            } else {
                return log.error(err);
            }
        })
    })
});
Stage.remove({}, function (err) {
    _.each(stages, function (data) {
        var stage = new Stage(data);
        stage.save(function (err, stage) {
            if (!err) {
                log.info("New stage - %s-%s", stage.stage, stage.suffix);
            } else {
                return log.error(err);
            }
        })
    })
});
Subject.remove({}, function (err) {
    _.each(subjects, function (data) {
        var subject = new Subject(data);
        subject.save(function (err, subject) {
            if (!err) {
                log.info("New subject - %s", subject.name);
            } else {
                return log.error(err);
            }
        })
    })
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