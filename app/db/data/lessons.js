/**
 * Created by trainee on 6/23/16.
 */
var lessons = [
    {
        classroom: 220,
        day: 'Monday',
        order: 1
    },
    {
        classroom: 305,
        day: 'Tuesday',
        order: 2
    },
    {
        classroom: 216,
        day: 'Wednesday',
        order: 1
    },
    {
        classroom: 101,
        day: 'Thursday',
        order: 4
    },
    {
        classroom: 306,
        day: 'Friday',
        order: 1
    },
    {
        classroom: 106,
        day: 'Wednesday',
        order: 0
    },
    {
        classroom: 207,
        day: 'Wednesday',
        order: 2
    }
];
function get() {
    return lessons;
}
exports.get = get;