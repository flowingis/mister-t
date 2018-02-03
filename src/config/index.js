'use strict'

const assert = require('assert')
const dotenv = require('dotenv')

dotenv.config()

assert(process.env.SLACK_API_TOKEN, 'SLACK_API_TOKEN is missing')
assert(process.env.DIALOG_FLOW_CLIENT_ACCESS_TOKEN, 'DIALOG_FLOW_CLIENT_ACCESS_TOKEN is missing')

module.exports = {
  debug: process.env.DEBUG,
  slackApiToken: process.env.SLACK_API_TOKEN,
  dialogFlowClientAccessToken: process.env.DIALOG_FLOW_CLIENT_ACCESS_TOKEN
}