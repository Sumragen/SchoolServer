/**
 * Created by trainee on 6/7/16.
 */
var libs = process.cwd() + '/app/',
    UserModel = require(libs + 'db/model/user'),
    AccessTokenModel = require(libs + 'db/model/accessToken'),
    RefreshTokenModel = require(libs + 'db/model/refreshToken'),
    config = require(libs + 'config'),
    oauth2orize = require('oauth2orize'),
    passport = require('passport');

var server = oauth2orize.createServer();

server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
    UserModel.findOne({username: username}, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);
        if (!user.checkPassword(password)) return done(null, false);

        RefreshTokenModel.remove({userId: user.userId, clientId: client.clientId}, function (err) {
            if (err) return done(err);
        });
        AccessTokenModel.remove({userId: user.userId, clientId: client.clientId}, function (err) {
            if (err) return done(err);
        });

        var tokenValue = crypto.randomBytes(32).toString('base64'),
            refreshTokenValue = crypto.randomBytes(32).toString('base64'),
            token = new AccessTokenModel({
                token: tokenValue,
                clientId: client.clientId,
                userId: user.userId
            }),
            refreshToken = new RefreshTokenModel({
                token: refreshTokenValue,
                clientId: client.clientId,
                userId: user.userId
            });
        refreshToken.save(function (err) {
            if (err) done(err);
        });
        var info = {scope: '*'};
        token.save(function (err, token) {
            if (err) return done(err);
            done(null, tokenValue, refreshToken, {'expires_in': config.get('security:tokenLife')});
        });
    })
}));
server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {
    RefreshTokenModel.findOne({token: refreshToken}, function (err, token) {
        if (err) return done(err);
        if (!token) return done(null, false);
        if (!token) return done(null, false);

        UserModel.findById(token.userId, function (err, user) {
            if (err) return done(err);
            if (!user) return done(null, false);

            RefreshTokenModel.remove({userId: user.userId, clientId: client.clientId}, function (err) {
                if (err) return done(err);
            });
            AccessTokenModel.remove({userId: user.userId, clientId: client.clientId}, function (err) {
                if (err) return done(err);
            });

            var tokenValue = crypto.randomBytes(32).toString('base64');
            var refreshTokenValue = crypto.randomBytes(32).toString('base64');
            var token = new AccessTokenModel({token: tokenValue, clientId: client.clientId, userId: user.userId});
            var refreshToken = new RefreshTokenModel({
                token: refreshTokenValue,
                clientId: client.clientId,
                userId: user.userId
            });
            refreshToken.save(function (err) {
                if (err) return done(err);
            });
            var info = {scope: '*'};
            token.save(function (err, token) {
                if (err) return done(err);
                done(null, tokenValue, refreshTokenValue, {'expires_in': config.get('security:tokenLife')});
            });
        });
    });
}));

exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], {session: false}),
    server.token(),
    server.errorHandler()
];