/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/libs/',
    Event = require(libs + 'model/event'),
    log = require(libs + 'log');

function checkOnError(err, item, next){
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
        var event = new Event(req.body);
        event.save(function (err) {
            if (err) {
                res.send({message: err});
            } else {
                log.info('Event created');
                res.status(200).json(event);
            }
        })
    });

    /**
     * Read
     */
    app.get('/api/events', function (req, res) {
        Event.find(function (err, events) {
            checkOnError(err, events, function () {
                res.status(200).json(events);
            });
        });
    });

    app.get('/api/event/:id', function (req, res) {
        Event.findById(req.params.id, function (err, event) {
            checkOnError(err, event, function () {
                res.status(200).json(event);
            });
        })
    });

    /**
     * Update
     */
    app.put('/api/event/:id', function (req, res) {
        Event.findById(req.params.id, function (err, event) {
            checkOnError(err, event, function () {
                event = req.body;
                event.save(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send(event);
                    }
                })
            });
        })
    });
    /**
     * Delete
     */
    app.delete('/api/event/:id', function (req, res) {
        Event.findById(req.params.id, function (err, event) {
            checkOnError(err, event, function () {
                event.remove(function (err) {
                    if(err){
                        res.status(err.code).send({message: err});
                    }else{
                        res.status(200).send({message: 'Event deleted'});
                    }
                })
            });
        });
    })
};