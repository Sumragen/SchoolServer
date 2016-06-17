/**
 * Created by trainee on 6/6/16.
 */

function initRoutes(app){
    require('./routes/event')(app);
    require('./routes/lesson')(app);
    require('./routes/role')(app);
    require('./routes/stage')(app);
    require('./routes/subject')(app);
    require('./routes/user')(app);
    require('./routes/teacher')(app);
}

exports.initRoutes = initRoutes;