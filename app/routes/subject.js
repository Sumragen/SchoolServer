/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/libs/',
    Subject = require(libs + 'model/subject'),
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
    app.get('/api/subject', function (req, res) {
        Subject.find(function (err, subjects) {
            checkOnError(err, subjects, function () {
                res.status(200).json(subjects);
            });
        });
    });

    app.get('/api/subject/:id', function (req, res) {
        Subject.findById(req.params.id, function (err, subject) {
            checkOnError(err, subject, function () {
                res.status(200).json(subject);
            });
        })
    });

    /**
     * Update
     */
    app.put('/api/subject/:id', function (req, res) {
        Subject.findById(req.params.id, function (err, subject) {
            checkOnError(err, subject, function () {
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
            checkOnError(err, subject, function () {
                subject.remove(function (err) {
                    if(err){
                        res.status(err.code).send({message: err});
                    }else{
                        res.status(200).send({message: 'Subject deleted'});
                    }
                })
            });
        });
    })
};