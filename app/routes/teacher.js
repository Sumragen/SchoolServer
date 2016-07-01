/**
 * Created by trainee on 6/17/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/',
    Teacher = require(libs + 'db/model/teacher'),
    User = require(libs + 'db/model/user'),
    log = require(libs + 'log');

function checkOnError(res, err, item, next) {
    if (err) {
        res.status(err.code).send({message: err});
    } else if (!item) {
        res.status(404).send({message: 'Not found!'});
    } else {
        next();
    }
}

module.exports = function (app) {
    //CRUD
    /**
     * Create
     */
    app.post('/api/teacher/add', function (req, res) {
        var teacher = new Teacher(req.body);
        teacher.save(function (err) {
            if (err) {
                res.send({message: err});
            } else {
                log.info('Teacher created');
                res.status(200).json(teacher);
            }
        })
    });

    /**
     * Read
     */
    app.get('/api/teachers', function (req, res) {
        Teacher.find(function (err, teachers) {
            checkOnError(res, err, teachers, function () {
                User.find(function (err, users) {
                    checkOnError(res, err, users, function () {
                        var resBody = [];
                        _.each(teachers, function (teacher) {
                            _.every(users, function (user) {
                                if (user._id.id == teacher.user.id) {
                                    resBody.push({
                                        subjects: teacher.subjects,
                                        user: {
                                            id: user._id,
                                            name: user.first_name + ' ' + user.last_name
                                        },
                                        _id: teacher._id
                                    });
                                    return false;
                                }
                                return true;
                            })
                        });
                        res.status(200).json(resBody);
                    })
                });
            });
        });
    });

    app.get('/api/teacher/:id', function (req, res) {
        Teacher.findById(req.params.id, function (err, teacher) {
            checkOnError(res, err, teacher, function () {
                res.status(200).json(teacher);
            });
        })
    });

    /**
     * Update
     */
    app.put('/api/teacher/:id', function (req, res) {
        Teacher.findById(req.params.id, function (err, teacher) {
            checkOnError(res, err, teacher, function () {
                teacher = req.body;
                teacher.save(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send(teacher);
                    }
                })
            });
        })
    });
    /**
     * Delete
     */
    app.delete('/api/teacher/:id', function (req, res) {
        Teacher.findById(req.params.id, function (err, teacher) {
            checkOnError(res, err, teacher, function () {
                teacher.remove(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send({message: 'Teacher deleted'});
                    }
                })
            });
        });
    })
};