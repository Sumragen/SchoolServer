/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/libs/',
    Stage = require(libs + 'model/stage'),
    Teacher = require(libs + 'model/teacher'),
    User = require(libs + 'model/user'),
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
    app.post('/api/stage/add', function (req, res) {
        var stage = new Stage(req.body);
        stage.save(function (err) {
            if (err) {
                res.send({message: err});
            } else {
                log.info('Stage created');
                res.status(200).json(stage);
            }
        })
    });

    /**
     * Read
     */
    app.get('/api/stages', function (req, res) {
        Stage.find(function (err, stages) {
            checkOnError(res, err, stages, function () {
                Teacher.find(function (err, teachers) {
                    checkOnError(res, err, teachers, function () {
                        User.find(function (err, users) {
                            checkOnError(res, err, users, function () {
                                var resBody = [];
                                _.each(stages, function (stage) {
                                    _.every(teachers, function (teacher) {
                                        if (stage.formMaster.id == teacher._id.id) {
                                            _.every(users, function (user) {
                                                if (teacher.user.id == user._id.id) {
                                                    resBody.push({
                                                        formMaster: {
                                                            id: teacher._id,
                                                            name: user.first_name + ' ' + user.last_name
                                                        },
                                                        stage: stage.stage,
                                                        suffix: stage.suffix,
                                                        _id: stage._id
                                                    });
                                                    return false;
                                                }
                                                return true;
                                            })
                                        }
                                        return true;
                                    })
                                });
                                res.status(200).json(resBody);
                            });
                        });
                    });
                });
            });
        });
    });

    app.get('/api/stage/:id', function (req, res) {
        Stage.findById(req.params.id, function (err, stage) {
            checkOnError(res, err, stage, function () {
                res.status(200).json(stage);
            });
        })
    });

    /**
     * Update
     */
    app.post('/api/stage/:id', function (req, res) {
        Stage.findById(req.params.id, function (err, stage) {
            checkOnError(res, err, stage, function () {
                Teacher.findById(req.body.formMaster, function (err, teacher) {
                    checkOnError(res, err, teacher, function () {
                        stage.formMaster = teacher._id;
                        User.findById(teacher.user, function (err, user) {
                            checkOnError(res, err, user, function () {
                                stage.save(function (err) {
                                    if (err) {
                                        res.status(err.code).send({message: err});
                                    } else {
                                        res.status(200).send({
                                            stage: stage.stage,
                                            suffix: stage.suffix,
                                            formMaster: {
                                                id: teacher._id,
                                                name: user.first_name + ' ' + user.last_name
                                            },
                                            _id: stage._id
                                        });
                                    }
                                })
                            });
                        });
                    });
                });
            });
        })
    });
    /**
     * Delete
     */
    app.delete('/api/stage/:id', function (req, res) {
        Stage.findById(req.params.id, function (err, stage) {
            checkOnError(res, err, stage, function () {
                stage.remove(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send({message: 'Stage deleted'});
                    }
                })
            });
        });
    })
};