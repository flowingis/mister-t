'use strict'

const skill = require('./skills')

module.exports = {
  replyTo: async (dialogFlowMessage) => skill(dialogFlowMessage.queryResult.action)(dialogFlowMessage),
  warnAboutMissingTimesheet: require('./skills/warnAboutMissingTimesheet')
}
