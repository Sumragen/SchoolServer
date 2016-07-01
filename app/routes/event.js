/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/',
    Event = require(libs + 'db/model/event'),
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
    app.post('/api/event/add', function (req, res) {
        req.body.date = new Date(req.body.date);
        var event = new Event(req.body);
        event.save(function (err) {
            if (err) {
                res.send({message: err});
            } else {
                res.status(200).json(event);
            }
        })
    });

    /**
     * Read
     */
    app.get('/api/events', function (req, res) {
        Event.find(function (err, events) {
            checkOnError(res, err, events, function () {
                res.status(200).json(events);
            });
        });
    });

    app.get('/api/event/:id', function (req, res) {
        Event.findById(req.params.id, function (err, event) {
            checkOnError(res, err, event, function () {
                res.status(200).json(event);
            });
        })
    });

    /**
     * Update
     */
    app.put('/api/event/:id', function (req, res) {
        Event.findById(req.params.id)
            .exec(function (err, event) {
                checkOnError(res, err, event, function () {
                    event.date = new Date(req.body.date);
                    event.description = req.body.description;
                    event.name = req.body.name;
                    event.save(function (err) {
                        if (err) {
                            res.status(err.code).send({message: err});
                        } else {
                            res.status(200).send(event);
                        }
                    })
                });
            });
    });
    app.put('/api/events', function (req, res) {
        Event.remove({}, function (err) {
            if (err) {
                res.status(500).send({message: err});
            } else {
                Event.collection.insert(req.body, function (err, events) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send(events);
                    }
                });
            }
        });
    });
    /**
     * Delete
     */
    app.delete('/api/event/:id', function (req, res) {
        Event.findById(req.params.id, function (err, event) {
            checkOnError(res, err, event, function () {
                event.remove(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send(event);
                    }
                })
            });
        });
    })
};