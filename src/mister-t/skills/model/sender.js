'use strict'

const config = require('../../../config/config')
const slack = require('../../../chat-platform/slack')({debug: true, token: config.slackApiToken})

module.exports = (req) => slack.sender(req.originalDetectIntentRequest)
