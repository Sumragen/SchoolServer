/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/libs/',
    User = require(libs + 'model/user'),
    Role = require(libs + 'model/role'),
    log = require(libs + 'log')(module),
    config = require(libs + 'config');

module.exports = function (app) {
    /**
     * Login
     */
    app.post('/api/login', function (request, response) {
        User.find({username: request.body.username}, function (err, user) {
            if (err) {
                response.status(404).json(err);
            } else if (user.length <= 0) {
                response.status(404).json({message: 'User not found'});
            } else if (user[0].checkPassword(request.body.password)) {
                user[0].getUserRoles()
                    .then(function (roles) {
                        user[0].roles = roles;
                        var currentUser = {
                            first_name: user[0].first_name,
                            last_name: user[0].last_name,
                            username: user[0].username,
                            email: user[0].email,
                            roles: user[0].roles,
                            _id: user[0]._id
                        };
                        request.session.authorized = true;
                        response.status(200).json({currentUser: currentUser, sessionID: request.sessionID});
                    });
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
        req.session.destroy(function (err) {
            if(err){
                res.status(err.code).send({message:err});
            }else{
                res.status(200).send({message:'OK'});
            }
        });
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
            var result = _.map(users, function (user) {
                return {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    email: user.email,
                    roles: user.roles,
                    _id: user._id
                }
            });
            if (request.query.limit && request.query.offset) {
                response.json(result.splice(Number(request.query.offset), Number(request.query.limit)))
            } else {
                response.json(result);
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
    app.put('/api/user/:id', function (request, response) {
        User.findById(request.params.id, function (err, user) {
            if (err) response.status(err.code).send({message: err});
            if (!user) response.status(404).send({message: 'User not found'});

            user.first_name = request.body.first_name;
            user.last_name = request.body.last_name;
            user.username = request.body.username;
            user.email = request.body.email;
            user.save(function (err) {
                if (!err) {
                    response.json(user);
                } else {
                    response.status(500).send({message: err});
                }
            })
        })
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
