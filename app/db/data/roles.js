/**
 * Created by trainee on 6/23/16.
 */
var p = require(process.cwd() + '/app/const.json').permissionSet;
var admin = {
    name: 'admin',
    description: 'admin rights',
    weight: 90,
    permissions: [p.isTeacher, p.hasAdminRights, p.canViewUsers, p.canEditUser, p.canAddUsers,
        p.canDeleteUsers, p.canViewSchedule, p.canEditSchedule, p.canAddSchedule, p.canDeleteSchedule,
        p.canViewEvents, p.canEditEvents, p.canAddEvents, p.canDeleteEvents, p.canViewStages, p.canEditStages, p.canAddStages, p.canDeleteStages]
};
var teacher = {
    name: 'teacher',
    description: 'teacher rights',
    weight: 50,
    permissions: [p.isTeacher,
        p.canViewUsers, p.canEditUser, p.canViewSchedule, p.canViewEvents, p.canEditEvents, p.canAddEvents, p.canDeleteEvents]
};
var student = {
    name: 'student',
    description: 'student rights',
    weight: 10,
    permissions: [p.canViewUsers,
        p.canEditUser, p.canViewSchedule, p.canViewEvents]
};
var roles = [admin, teacher, student];
function get() {
    return roles;
}
exports.get = get;