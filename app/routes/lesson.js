/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/libs/',
    Lesson = require(libs + 'model/lesson'),
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
    app.post('/api/lesson/add', function (req, res) {
        var lesson = new Lesson(req.body);
        lesson.save(function (err) {
            if (err) {
                res.send({message: err});
            } else {
                log.info('Lesson created');
                res.status(200).json(lesson);
            }
        })
    });

    /**
     * Read
     */
    app.get('/api/lessons', function (req, res) {
        Lesson.find(function (err, lessons) {
            checkOnError(err, lessons, function () {
                res.status(200).json(lessons);
            });
        });
    });

    app.get('/api/lesson/:id', function (req, res) {
        Lesson.findById(req.params.id, function (err, lesson) {
            checkOnError(err, lesson, function () {
                res.status(200).json(lesson);
            });
        })
    });

    /**
     * Update
     */
    app.put('/api/lesson/:id', function (req, res) {
        Lesson.findById(req.params.id, function (err, lesson) {
            checkOnError(err, lesson, function () {
                lesson = req.body;
                lesson.save(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send(lesson);
                    }
                })
            });
        })
    });
    /**
     * Delete
     */
    app.delete('/api/lesson/:id', function (req, res) {
        Lesson.findById(req.params.id, function (err, lesson) {
            checkOnError(err, lesson, function () {
                lesson.remove(function (err) {
                    if(err){
                        res.status(err.code).send({message: err});
                    }else{
                        res.status(200).send({message: 'Lesson deleted'});
                    }
                })
            });
        });
    })
};