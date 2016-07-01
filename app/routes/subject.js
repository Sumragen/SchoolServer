/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/',
    Subject = require(libs + 'db/model/subject'),
    Teacher = require(libs + 'db/model/teacher'),
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
    app.post('/api/subject/add', function (req, res) {
        var subject = new Subject(req.body);
        subject.save(function (err) {
            if (err) {
                res.send({message: err});
            } else {
                log.info('Subject created');
                res.status(200).json(subject);
            }
        })
    });

    /**
     * Read
     */
    app.get('/api/subjects', function (req, res) {
        Subject.find(function (err, subjects) {
            checkOnError(res, err, subjects, function () {
                res.status(200).json(subjects);
            });
        });
    });

    app.get('/api/subject/:id', function (req, res) {
        Subject.findById(req.params.id, function (err, subject) {
            checkOnError(res, err, subject, function () {
                res.status(200).json(subject);
            });
        })
    });
    app.get('/api/subject/teacher/:id', function (req, res) {
        Teacher.find({"user": req.params.id}, function (err, teacher) {
            if (teacher[0] && !err && req) {
                Subject.find(function (err, subjects) {
                    if (subjects && !err) {
                        var resBody = [];
                        _.each(teacher[0].subjects, function (sub) {
                            _.every(subjects, function (subject) {
                                if (sub.id == subject._id.id) {
                                    resBody.push(subject);
                                    return false;
                                }
                                return true;
                            });
                        });
                        res.status(200).send(resBody);
                    } else {
                        res.status(err ? err.code : 404).send({message: err || 'Subjects not found'});
                    }

                });
            } else {
                res.status(!err ? 200 : 404).send({message: err || 'Teacher not found'});
            }
        })
    });

    /**
     * Update
     */
    app.put('/api/subject/:id', function (req, res) {
        Subject.findById(req.params.id, function (err, subject) {
            checkOnError(res, err, subject, function () {
                subject = req.body;
                subject.save(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send(subject);
                    }
                })
            });
        })
    });
    /**
     * Delete
     */
    app.delete('/api/subject/:id', function (req, res) {
        Subject.findById(req.params.id, function (err, subject) {
            checkOnError(res, err, subject, function () {
                subject.remove(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send({message: 'Subject deleted'});
                    }
                })
            });
        });
    })
};