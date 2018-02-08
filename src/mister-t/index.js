'use strict'
const skills = require('./skills')

module.exports = function (data) {
  const replyTo = async (dialogFlowMessage) => skills(dialogFlowMessage.result.action)(data)(dialogFlowMessage)

  return {
    replyTo,
    warnAboutMissingTimesheet: require('./skills/warnAboutMissingTimesheet')(data)
  }
}
