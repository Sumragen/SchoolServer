/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/libs/',
    Lesson = require(libs + 'model/lesson'),
    Stage = require(libs + 'model/stage'),
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

function transformData(from, to) {
    from.classroom = to.classroom;
    from.stage = to.stage;
    from.teacher = to.teacher;
    from.subject = to.subject;
    from.order = to.order;
    from.day = to.day;
}

module.exports = function (app) {
    //CRUD
    /**
     * Create
     */
    app.post('/api/lesson/add', function (req, res) {
        Stage.findOne({stage: req.body.stage, suffix: req.body.suffix})
            .exec(function (err, stage) {
                if (err || !stage) {
                    res.status(500).send({message: err || 'Stage not found'});
                } else {
                    req.body.stage = stage._id;
                    var newLesson = new Lesson(req.body);
                    Lesson.find()
                        .exec(function (err, lessons) {
                            if (_.every(lessons, function (existLesson) {
                                    if (existLesson.day == newLesson.day
                                        && existLesson.order == newLesson.order
                                        && (existLesson.teacher.id == newLesson.teacher.id || existLesson.classroom == newLesson.classroom)
                                        && existLesson._id.id != newLesson._id.id) {
                                        if (existLesson.teacher.id == newLesson.teacher.id) {
                                            res.status(400).send({message: 'That teacher is busy'})
                                        } else {
                                            res.status(400).send({message: 'That classroom is busy'})
                                        }
                                        return false
                                    }
                                    return true;
                                })) {
                                update(res, newLesson);
                            }
                        });
                }
            });
    });

    /**
     * Read
     */
    app.get('/api/lessons', function (req, res) {
        Lesson.find(function (err, lessons) {
            checkOnError(res, err, lessons, function () {
                res.status(200).json(lessons);
            });
        });
    });

    app.get('/api/lesson/:id', function (req, res) {
        Lesson.findById(req.params.id, function (err, lesson) {
            checkOnError(res, err, lesson, function () {
                res.status(200).json(lesson);
            });
        })
    });
    app.get('/api/lesson/stage/:id', function (req, res) {
        Lesson.find({stage: req.params.id})
            .populate('stage subject teacher')
            .exec(function (err, lessons) {
                if (err || !lessons || lessons.length <= 0) {
                    res.status(err ? 500 : 404).send({message: err || 'Lessons not found'});
                } else {
                    var options = {
                        path: 'teacher.user',
                        model: 'User'
                    };
                    Lesson.populate(lessons, options, function (err, lessons) {
                        if (!err) {
                            res.status(200).send(lessons);
                        } else {
                            res.status(500);
                        }
                    });
                }
            })
    });
    app.get('/api/lesson/day/:day', function (req, res) {
        Lesson.find({day: req.params.day})
            .populate('stage subject teacher')
            .exec(function (err, lessons) {
                if (err || !lessons || lessons.length <= 0) {
                    res.status(err ? 500 : 404).send({message: err || 'Lessons not found'});
                } else {
                    var options = {
                        path: 'teacher.user',
                        model: 'User'
                    };
                    Lesson.populate(lessons, options, function (err, lessons) {
                        if (err || !lessons || lessons.length <= 0) {
                            res.status(err ? 500 : 404).send({message: err || 'Lessons not found'});
                        } else {
                            res.status(200).send(lessons);
                        }
                    });
                }
            })
    });

    /**
     * Update
     */
    function update(res, lesson) {
        lesson.save(function (err) {
            if (err) {
                res.status(500).send({message: err});
            } else {
                var options = {
                    path: 'stage subject teacher'
                };
                Lesson.populate(lesson, options, function (err, lesson) {
                    var options = {
                        path: 'teacher.user',
                        model: 'User'
                    };
                    Lesson.populate(lesson, options, function (err, lesson) {
                        if (!err) {
                            res.status(200).send(lesson);
                        } else {
                            res.status(500);
                        }
                    });
                });
            }
        })
    }

    app.post('/api/lesson/:id', function (req, res) {
        Lesson.find()
            .exec(function (err, lessons) {
                var newLesson = _.find(lessons, function (lesson) {
                    return lesson._id == req.params.id;
                });
                transformData(newLesson, req.body);
                //check: is teacher busy
                if (_.every(lessons, function (existLesson) {
                        if (existLesson.day == newLesson.day
                            && existLesson.order == newLesson.order
                            && (existLesson.teacher.id == newLesson.teacher.id || existLesson.classroom == newLesson.classroom)
                            && existLesson._id.id != newLesson._id.id) {
                            if (existLesson.teacher.id == newLesson.teacher.id) {
                                res.status(400).send({message: 'That teacher is busy'})
                            } else {
                                res.status(400).send({message: 'That classroom is busy'})
                            }
                            return false
                        }
                        return true;
                    })) {
                    update(res, newLesson);
                }
            });
    });
    /**
     * Delete
     */
    app.delete('/api/lesson/:id', function (req, res) {
        Lesson.findById(req.params.id, function (err, lesson) {
            checkOnError(res, err, lesson, function () {
                lesson.remove(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send({message: 'Lesson deleted'});
                    }
                })
            });
        });
    });

    //default schedule
    app.get('/api/schedule', function (req, res) {
        var defaultSchedule = {
            id: 1,
            stage: 5,
            suffix: 'A',
            formMaster: {
                id: 1,
                name: 'Lisa Kuddrow'
            },
            schedule: [
                {
                    name: 'Monday',
                    lessons: [
                        {
                            id: 1,
                            lesson: 'History',
                            teacher: 'Victor Kotov',
                            classroom: 32,
                            order: [1, 4]
                        },
                        {
                            lesson: 'Math',
                            teacher: 'Demi Moor',
                            classroom: 12,
                            order: [3]
                        }
                    ]
                }, {
                    name: 'Tuesday',
                    lessons: [
                        {
                            lesson: 'OOP',
                            teacher: 'Alan Moor',
                            classroom: 32,
                            order: [0, 3]
                        },
                        {
                            lesson: 'Math',
                            teacher: 'Demi Moor',
                            classroom: 12,
                            order: [2]
                        },
                        {
                            lesson: 'Math',
                            teacher: 'Demi Moor',
                            classroom: 12,
                            order: [1]
                        }
                    ]
                }, {
                    name: 'Wednesday',
                    lessons: [
                        {
                            lesson: 'Litrature',
                            teacher: 'Alan Moor',
                            classroom: 32,
                            order: [2, 4]
                        },
                        {
                            lesson: 'Math',
                            teacher: 'Demi Moor',
                            classroom: 12,
                            order: [3]
                        }
                    ]
                }, {
                    name: 'Thursday',
                    lessons: [
                        {
                            lesson: 'Litrature',
                            teacher: 'Alan Moor',
                            classroom: 32,
                            order: [1, 3]
                        },
                        {
                            lesson: 'Math',
                            teacher: 'Demi Moor',
                            classroom: 12,
                            order: [2]
                        }
                    ]
                }, {
                    name: 'Friday',
                    lessons: [
                        {
                            lesson: 'Biology',
                            teacher: 'Alan Moor',
                            classroom: 32,
                            order: [1, 3]
                        },
                        {
                            lesson: 'Math',
                            teacher: 'Demi Moor',
                            classroom: 12,
                            order: [2]
                        }
                    ]
                }
            ]
        };
        res.status(200).send(defaultSchedule);
    });
};