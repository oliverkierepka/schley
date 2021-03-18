cordova.define("com.hriston.phonegap.plugins.calendar.calendar", function(require, exports, module) {var exec = require('cordova/exec');

var calendarExport = {};

calendarExport.createEvent = function (title, location, notes, startDate, endDate, successCallback, errorCallback) {
  exec(successCallback, errorCallback, "Calendar", "createEvent", [title, location, notes, startDate.getTime(), endDate.getTime()]);
};

calendarExport.findEvent = function (eventTypes, startDate, endDate, successCallback, errorCallback) {
  exec(successCallback, errorCallback, "Calendar", "findEvent", [eventTypes, startDate.getTime(), endDate.getTime()]);
};

module.exports = calendarExport;});
