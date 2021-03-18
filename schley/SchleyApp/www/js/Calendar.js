cordova.define("com.hriston.phonegap.plugins.calendar.Calendar", function(require, exports, module) {cordova.define("com.hriston.phonegap.calendar.Calendar", function(require, exports, module) {"use strict";
function Calendar() {
}

Calendar.prototype.createEvent = function (title, location, notes, startDate, endDate, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "Calendar", "createEvent", [title, location, notes, startDate.getTime(), endDate.getTime()]);
};

Calendar.prototype.findEvent = function (eventTypes, startDate, endDate, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "Calendar", "findEvent", [eventTypes, startDate.getTime(), endDate.getTime()]);
};

Calendar.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.calendar = new Calendar();
  return window.plugins.calendar;
};

cordova.addConstructor(Calendar.install);});
});
