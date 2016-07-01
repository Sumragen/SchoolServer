/**
 * Created by trainee on 6/23/16.
 */
var events = [
    {
        name: 'Rest',
        date: 'February 19, 2016 11:50 AM',
        description: 'first event (test version)',
        address: {
            city: 'Kherson',
            country: 'Ukraine'
        },
        location: {
            latitude: 46.6699334,
            longitude: 32.6169105
        }
    },
    {
        name: "Children's hospital",
        date: 'September 23, 2016 2:30 PM',
        description: 'Medical inspection',
        address: {
            city: 'Kherson',
            country: 'Ukraine'
        },
        location: {
            latitude: 46.6676171,
            longitude: 32.6100075
        }
    },
    {
        name: 'spring ball',
        date: 'April 15, 2016 4:00 PM',
        description: 'spring ball',
        address: {
            city: 'Kherson',
            country: 'Ukraine'
        },
        location: {
            latitude: 46.6716115,
            longitude: 32.6100684
        }
    }
];
function get(){
    return events;
}
exports.get = get;