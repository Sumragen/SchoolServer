/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/libs/',
    User = require(libs + 'model/user'),
    Role = require(libs + 'model/role'),
    Stage = require(libs + 'model/stage'),
    Teacher = require(libs + 'model/teacher'),
    log = require(libs + 'log')(module),
    config = require(libs + 'config');

module.exports = function (app) {
    /**
     * Login
     */
    app.post('/api/login', function (request, response) {
        User.findOne({username: request.body.username})
            .populate('roles')
            .exec(function (err, user) {
                if (err || !user) {
                    response.status(404).send({message: 'User not found'});
                } else if (user.checkPassword(request.body.password)) {
                    request.headerSession.getSession()
                        .then(function (session) {
                            session['user'] = user;
                            response.status(200).json({
                                currentUser: user.getValues(),
                                sessionID: request.headerSession.token
                            });
                        })
                } else {
                    response.status(404).send({message: 'User not found'});
                }
            });
    });

    /**
     * Logout
     */
    app.post('/api/logout', function (req, res) {
        //delete req.session.authorized;
        //req.session.destroy(function (err) {
        //    if(err){
        //        res.status(err.code).send({message:err});
        //    }else{
        res.status(200).send({message: 'OK'});
        //    }
        //});
    });

    /**
     * Create
     */
        //register
    app.post('/api/user/add', function (request, response) {
        var user = new User(request.body);
        Role.findOne({name: config.get('default:role')}, function (err, role) {
            if (err) {
                response.status(404).send({message: err});
            } else if (!role) {
                response.status(500).send({message: 'Role not found (server side)'});
            } else {
                user.roles.push(role._id);
                user.save(function (err) {
                    if (!err) {
                        log.info('User created!');
                        response.status(200).json(user);
                    } else {
                        if (err.name == 'ValidationError') {
                            response.status(400).send({message: 'Validation error'});
                        } else if (err.code == 11000) {
                            response.status(401).send({message: 'User with that data is exist'})
                        } else {
                            response.status(500).send({message: err});
                        }
                        log.error('Internal error(%d): %s', response.statusCode, err.message);
                    }
                });
            }
        });
    });

    /**
     * Read
     */
        // List
    app.get('/api/users', function (request, response) {
        User.find(function (err, users) {
            if (err || !users) {
                response.status(500).send({message: err || 'Users not found'});
            } else {
                var result = _.map(users, function (user) {
                    return user.getValues();
                });
                if (request.query.limit && request.query.offset) {
                    response.status(200).json(result.splice(Number(request.query.offset), Number(request.query.limit)))
                } else {
                    response.status(200).json(result);
                }
            }
        });
    });

    // Get user by id
    app.get('/api/user/:id', function (request, response) {
        User.findById(request.params.id, function (err, user) {
            if (!err) {
                response.json(user);
            } else {
                response.status(500).send({message: err});
            }
        });
    });

    /**
     * Update
     */
        //post -> put (pre-flight)
    app.post('/api/user/:id', function (request, response) {
        if (!request.body) {
            response.status(400);
        } else {
            User.findById(request.params.id, function (err, user) {
                if (err || !user) {
                    response.status(!user ? 404 : 500).send({message: !user ? 'User not found' : err})
                } else {
                    var reqBody = request.body;
                    user.first_name = reqBody.first_name;
                    user.last_name = reqBody.last_name;
                    user.username = reqBody.username;
                    user.email = reqBody.email;
                    Role.findById(reqBody.role, function (err, role) {
                        if (!err && role) {
                            user.roles = [role];
                            user.save(function (err, user) {
                                if (!err) {
                                    request.headerSession.getSession()
                                        .then(function (session) {
                                            if (session.user._id == user.id) {
                                                session.user = user;
                                            }
                                            if (role.weight >= 50 && reqBody.subjects && reqBody.subjects.length > 0) {
                                                Teacher.findOne({'user': reqBody.id}, function (err, teacher) {
                                                    if (err) {
                                                        response.status(500).send({message: err});
                                                    } else {
                                                        var subjects = _.map(reqBody.subjects, function (subject) {
                                                            return subject.id;
                                                        });
                                                        if (teacher) {
                                                            teacher.subjects = subjects;
                                                        } else {
                                                            teacher = new Teacher({
                                                                user: user._id,
                                                                subjects: subjects
                                                            });
                                                        }
                                                        teacher.save(function (err) {
                                                            if (err) {
                                                                response.status(500).send({message: err});
                                                            } else {
                                                                response.status(200).json(user.getValues());
                                                            }
                                                        });
                                                    }
                                                })
                                            } else {
                                                Stage.find()
                                                    .populate('formMaster')
                                                    .exec(function (err, stages) {
                                                        if (_.every(stages, function (stage) {
                                                                return stage.formMaster.user.id != user._id.id
                                                            })) {
                                                            Teacher.remove({'user': reqBody.id}, function (err) {
                                                                if (err) {
                                                                    response.status(500).send({message: err});
                                                                } else {
                                                                    response.status(200).json(user);
                                                                }
                                                            });
                                                        } else {
                                                            response.status(400).send({message: 'That user is form master'});
                                                        }
                                                    });
                                            }
                                        })
                                } else {
                                    response.status(500).send({message: err});
                                }
                            })
                        }
                    });
                }
            })
        }
    });

    /**
     * Delete
     */
    app.delete('/api/user/:id', function (request, response) {
        User.findById(request.params.id, function (err, user) {
            if (err) response.status(err.code).send({message: err});
            if (!user) response.status(404).send({message: 'User not found'});

            user.remove(function (err) {
                if (err) {
                    response.status(err.code).send({message: err});
                } else {
                    response.status(200).send({message: 'User deleted'});
                }
            })
        })
    });
};
