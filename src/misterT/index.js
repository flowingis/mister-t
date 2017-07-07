'use strict';
const skills = require('./skills')

module.exports = function(data) {
  return {
    replyTo: (action) => skills(action)(data),
    warnAboutMissingTimesheet: require('./skills/warnAboutMissingTimesheet')(data)
  }
}
