'use strict';

const NO_RESPONSE = {
  speech: '',
  displayText: '',
  source: 'mister-t-webhook'
}
module.exports = function(action) {
  const actions = {
    getTimesheet: require('./getTimesheet')
  }

  if(!actions[action]) {
    return () => async () => NO_RESPONSE
  }

  return actions[action]
}