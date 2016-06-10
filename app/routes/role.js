/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/libs/',
    Role = require(libs + 'model/role'),
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
    app.post('/api/role/add', function (req, res) {
        var role = new Role(req.body);
        role.save(function (err) {
            if (err) {
                res.send({message: err});
            } else {
                log.info('Role created');
                res.status(200).json(role);
            }
        })
    });

    /**
     * Read
     */
    app.get('/api/roles', function (req, res) {
        Role.find(function (err, roles) {
            checkOnError(err, roles, function () {
                res.status(200).json(roles);
            });
        });
    });

    app.get('/api/role/:id', function (req, res) {
        Role.findById(req.params.id, function (err, role) {
            checkOnError(err, role, function () {
                res.status(200).json(role);
            });
        })
    });

    /**
     * Update
     */
    app.put('/api/role/:id', function (req, res) {
        Role.findById(req.params.id, function (err, role) {
            checkOnError(err, role, function () {
                role = req.body;
                role.save(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send(role);
                    }
                })
            });
        })
    });
    /**
     * Delete
     */
    app.delete('/api/role/:id', function (req, res) {
        Role.findById(req.params.id, function (err, role) {
            checkOnError(err, role, function () {
                role.remove(function (err) {
                    if(err){
                        res.status(err.code).send({message: err});
                    }else{
                        res.status(200).send({message: 'Role deleted'});
                    }
                })
            });
        });
    })
};