/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/libs/',
    Stage = require(libs + 'model/stage'),
    log = require(libs + 'log');

function checkOnError(err, item, next) {
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
            checkOnError(err, stages, function () {
                res.status(200).json(stages);
            });
        });
    });

    app.get('/api/stage/:id', function (req, res) {
        Stage.findById(req.params.id, function (err, stage) {
            checkOnError(err, stage, function () {
                res.status(200).json(stage);
            });
        })
    });

    /**
     * Update
     */
    app.put('/api/stage/:id', function (req, res) {
        Stage.findById(req.params.id, function (err, stage) {
            checkOnError(err, stage, function () {
                stage = req.body;
                stage.save(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send(stage);
                    }
                })
            });
        })
    });
    /**
     * Delete
     */
    app.delete('/api/stage/:id', function (req, res) {
        Stage.findById(req.params.id, function (err, stage) {
            checkOnError(err, stage, function () {
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