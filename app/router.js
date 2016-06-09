/**
 * Created by trainee on 6/6/16.
 */

function initRoutes(app){
    require('./routes/user')(app);
}

exports.initRoutes = initRoutes;