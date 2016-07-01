/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/',
    Lesson = require(libs + 'db/model/lesson'),
    Stage = require(libs + 'db/model/stage'),
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
                if (err) {
                    res.status(500).send({message: err});
                } else if (!lessons || lessons.length <= 0) {
                    Stage.findById(req.params.id)
                        .exec(function (err, stage) {
                            if (err || !stage) {
                                res.status(err ? 500 : 404).send({message: err || 'Stage not found'});
                            } else {
                                res.status(200).send({stage: stage});
                            }
                        });
                } else {
                    var options = {
                        path: 'teacher.user',
                        model: 'User'
                    };
                    Lesson.populate(lessons, options, function (err, lessons) {
                        if (!err) {
                            res.status(200).send({stage: lessons[0].stage, lessons: lessons});
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

    app.put('/api/lesson/:id', function (req, res) {
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
        Stage.findOne()
            .exec(function (err, stage) {
                if (err) {
                    res.status(err ? 500 : 404).send({message: err || 'Stage not found'});
                } else {
                    Lesson.find({stage: stage._id})
                        .populate('stage subject teacher')
                        .exec(function (err, lessons) {
                            if (err) {
                                res.status(500).send({message: err});
                            } else if (!lessons || lessons.length <= 0) {
                                res.status(200).send({stage: stage});
                            } else {
                                var options = {
                                    path: 'teacher.user',
                                    model: 'User'
                                };
                                Lesson.populate(lessons, options, function (err, lessons) {
                                    if (!err) {
                                        res.status(200).send({stage: stage, lessons: lessons});
                                    } else {
                                        res.status(500);
                                    }
                                });
                            }
                        })
                }
            });
    });
};