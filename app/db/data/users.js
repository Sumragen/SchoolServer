/**
 * Created by trainee on 6/23/16.
 */
var users = [{
    first_name: 'Eric',
    last_name: 'Tituashvili',
    username: 'admin',
    email: 'Davidich@smotra.ru',
    password: 'admin',
    roles: ['admin']
},
    {
        first_name: 'Aleksey',
        last_name: 'Zarrubin',
        username: 'teacher',
        email: 'zarrubin@24auto.ru',
        password: 'teacher',
        roles: ['teacher']
    },
    {
        first_name: 'George',
        last_name: 'Chivchan',
        username: 'student',
        email: 'Gocha@gmail.com',
        password: 'student',
        roles: ['student']
    }];
function get() {
    return users
}
exports.get = get;