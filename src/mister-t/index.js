'use strict'
const skill = require('./skills')

module.exports = {
  replyTo: async (dialogFlowMessage) => skill(dialogFlowMessage.result.action)(dialogFlowMessage),
  warnAboutMissingTimesheet: require('./skills/warnAboutMissingTimesheet')
}
