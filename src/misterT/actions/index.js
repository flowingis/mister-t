'use strict';

module.exports = function(action) {
  const actions = {
    getTimesheet: require('./getTimesheet')
  }

  return actions[action]
}