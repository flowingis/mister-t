'use strict';
const moment = require('moment')

module.exports = function(timeEntry) {
  return {
    projectName: timeEntry.projectName,
    issue: timeEntry.activity,
    hours: hours(timeEntry.duration),
    date: moment(timeEntry.date)
  }
}

function hours(duration) {
  const toHours = {
    giorno: 8,
    ora: 1,
  }

  if(!toHours[duration.unit]) {
    throw new InvalidDurationUnitError(`${duration.unit} is not a valid unit of time, giorno or ora allowed`)
  }

  return duration.amount * toHours[duration.unit]
}

function InvalidDurationUnitError(message) {
  this.name = 'InvalidDurationUnitError';
  this.message = message || 'Default Message';
  this.stack = (new Error()).stack;
}
InvalidDurationUnitError.prototype = Object.create(Error.prototype);
InvalidDurationUnitError.prototype.constructor = InvalidDurationUnitError;