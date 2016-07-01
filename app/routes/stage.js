/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/',
    Stage = require(libs + 'db/model/stage'),
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
    app.post('/api/stage/add', function (req, res) {
        var newStage = new Stage(req.body);
        Stage.find()
            .exec(function (err, stages) {
                checkOnError(res, err, stages, function () {
                    if (_.every(stages, function (stage) {
                            return !(stage.stage == newStage.stage && stage.suffix == newStage.suffix)
                        })) {
                        newStage.save(function (err) {
                            if (err) {
                                res.send({message: err});
                            } else {
                                Stage.populate(newStage, {path: 'formMaster'}, function (err, newStage) {
                                    var options = {
                                        path: 'formMaster.user',
                                        model: 'User'
                                    };
                                    if (err) {
                                        res.status(500).send({message: err});
                                    } else {
                                        Stage.populate(newStage, options, function (err, newStage) {
                                            res.status(200).send(createResponseBody(newStage));
                                        });
                                    }
                                });
                            }
                        })
                    } else {
                        res.status(400).send({message: 'That stage already exist'});
                    }
                });
            });
    });

    /**
     * Read
     */
    function createResponseBody(stage) {
        return {
            formMaster: {
                id: stage.formMaster._id,
                name: stage.formMaster.user.first_name + ' ' + stage.formMaster.user.last_name
            },
            stage: stage.stage,
            suffix: stage.suffix,
            _id: stage._id
        }
    }

    app.get('/api/stages', function (req, res) {
        Stage.find()
            .populate('formMaster')
            .exec(function (err, stages) {
                var options = {
                    path: 'formMaster.user',
                    model: 'User'
                };
                if (err) {
                    res.status(500).send({message: err});
                } else {
                    Stage.populate(stages, options, function (err, stages) {
                        var responseBody = [];
                        _.each(stages, function (stage) {
                            responseBody.push(createResponseBody(stage))
                        });
                        res.status(200).send(responseBody);
                    });
                }
            })
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
    app.put('/api/stage/:id', function (req, res) {
        Stage.findById(req.params.id)
            .exec(function (err, stage) {
                stage.formMaster = req.body.formMaster;
                var options = {
                    path: 'formMaster',
                    model: 'Teacher'
                };
                Stage.populate(stage, options, function (err, stage) {
                    var options = {
                        path: 'formMaster.user',
                        model: 'User'
                    };
                    Stage.populate(stage, options, function (err, stage) {
                        if (err) {
                            res.status(500).send({message: err});
                        } else {
                            stage.save(function (err) {
                                if (err) {
                                    res.status(500);
                                } else {
                                    res.status(200).send(createResponseBody(stage));
                                }
                            });
                        }
                    });
                });
            });
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