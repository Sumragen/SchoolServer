/**
 * Created by trainee on 6/7/16.
 */
var libs = process.cwd() + '/app/libs/',
    UserModel = require(libs + 'model/user'),
    ClientModel = require(libs + 'model/client'),
    AccessTokenModel = require(libs + 'model/accessToken'),
    config = require(libs + 'config'),
    passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy;

function returnResult(err, client, done, clientSecret) {
    if (err) return done(err);
    if (!client) return done(null, false);
    if (client.clientSecret != clientSecret) return done(null, false);

    return done(null, client);
}
passport.use(new BasicStrategy(
    function (username, password, done) {
        ClientModel.findOne({clientId: username}, function (err, client) {
            return returnResult(err, client, done, password);
        })
    }
));

passport.use(new ClientPasswordStrategy(
    function (clientId, clientSecret, done) {
        ClientModel.findOne({clientId: clientId}, function (err, client) {
            return returnResult(err, client, done, clientSecret);
        })
    }
));

passport.use(new BearerStrategy(
    function (accessToken, done) {
        AccessTokenModel.findOne({token: accessToken}, function (err, token) {
            if (err) return done(err);
            if (!token) return done(null, false);

            if (Math.round(Date.now() - token.created) / 1000 > config.get('security:tokenLife')) {
                AccessTokenModel.remove({token: accessToken}, function (err) {
                    if (err) return done(err);
                });
                return done(null, false, {message: 'token expired'})
            }

            UserModel.findById(token.userId, function (err, user) {
                if (err) return done(err);
                if (!user) return done(null, false, {message: 'Unknown user'});

                var info = {scope: '*'};
                done(null, user, info);
            });
        })
    }
));
