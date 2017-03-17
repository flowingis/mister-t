'use strict';

const timeSheet = require('./timesheet');

module.exports = function(endPoint, apiKey) {
  return {
    timeSheet: timeSheet(endPoint, apiKey)
  }
};
