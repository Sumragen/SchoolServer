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
    app.post('/api/stage/:id', function (req, res) {
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