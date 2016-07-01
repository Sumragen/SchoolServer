/**
 * Created by trainee on 6/7/16.
 */
var faker = require('faker');
var _ = require('lodash');

var libs = process.cwd() + '/app/';

// models
var db = libs + 'db/model/',
    User = require(db + 'user'),
    Role = require(db + 'role'),
    Event = require(db + 'event'),
    Lesson = require(db + 'lesson'),
    Stage = require(db + 'stage'),
    Subject = require(db + 'subject'),
    Teacher = require(db + 'teacher'),
    Client = require(db + 'client'),
    AccessToken = require(db + 'accessToken'),
    RefreshToken = require(db + 'refreshToken');


var log = require(libs + 'log')(module),
    db = require(libs + 'db/mongoose'),
    config = require(libs + 'config'),
    consts = require('./const.json');

//default data
var roles = require('./db/data/roles').get(),
    users = require('./db/data/users').get(),
    events = require('./db/data/events').get(),
    lessons = require('./db/data/lessons').get(),
    stages = require('./db/data/stages').get(),
    subjects = require('./db/data/subjects').get();

var order = {
    'Role': 1,
    'User': 2, //role
    'Subject': 3,
    'Teacher': 4, //user, subject
    'Stage': 5, //teacher
    'Event': 6,
    'Lesson': 7, //stage, teacher, subject
};
var interval = 1000;

function setOrder(name, next) {
    setTimeout(function () {
        console.log('---- ' + order[name] + ' ----');
        next();
    }, order[name] * interval);
}
setOrder('Role', function () {
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
});
setOrder('User', function () {
    User.remove({}, function (err) {
        Role.find(function (err, roles) {
            _.each(users, function (userEntity) {
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
});
setOrder('Event', function () {
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
});
setOrder('Lesson', function () {
    Lesson.remove({}, function (err) {
        Stage.find()
            .exec(function (err, stages) {
                if (!err) {
                    Subject.find()
                        .exec(function (err, subjects) {
                            if (!err) {
                                Teacher.find(function (err, teachers) {
                                    _.each(lessons, function (data, index) {
                                        var lesson = new Lesson(data);
                                        lesson.stage = stages[index]._id;
                                        lesson.subject = subjects[0]._id;
                                        lesson.teacher = teachers[0]._id;
                                        lesson.save(function (err, lesson) {
                                            if (!err) {
                                                log.info("New lesson for %s-%s", stages[index].stage, stages[index].suffix);
                                            } else {
                                                return log.error(err);
                                            }
                                        })
                                    })
                                });
                            }
                        });
                }
            });
    });
});
setOrder('Stage', function () {
    Stage.remove({}, function (err) {
        Teacher.find(function (err, teachers) {
            _.each(stages, function (data) {
                var stage = new Stage(_.merge(data, {formMaster: teachers[0]._id}));
                stage.save(function (err, stage) {
                    if (!err) {
                        log.info("New stage - %s-%s", stage.stage, stage.suffix);
                    } else {
                        return log.error(err);
                    }
                })
            })
        });
    });
});
setOrder('Subject', function () {
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
});
setOrder('Teacher', function () {
    Teacher.remove({}, function (err) {
        User.find(function (err, users) {
            Subject.find(function (err, subjects) {
                _.each(users, function (user) {
                    var teacher = new Teacher({
                        user: user._id,
                        subjects: [subjects[0]._id, subjects[1]._id]
                    });
                    teacher.save(function (err, teacher) {
                        if (!err) {
                            log.info('New teacher');
                        } else {
                            return log.error(err);
                        }
                    })
                })
            })
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
}, 10 * 1000);