'use strict'

const logger = require('../../logger')()

const NO_RESPONSE = {
  speech: '',
  displayText: '',
  source: 'mister-t-webhook'
}
module.exports = function (action) {
  const actions = {
    getTimesheet: require('./getTimesheet')
  }

  if (!actions[action]) {
    logger.debug(action, 'No skill found')
    return () => async () => NO_RESPONSE
  }

  return actions[action]
}
