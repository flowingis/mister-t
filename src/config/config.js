'use strict'

const assert = require('assert')
const dotenv = require('dotenv')

dotenv.config()

assert(process.env.SLACK_API_TOKEN, 'SLACK_API_TOKEN is missing')
assert(process.env.DIALOG_FLOW_CLIENT_ACCESS_TOKEN, 'DIALOG_FLOW_CLIENT_ACCESS_TOKEN is missing')
assert(process.env.REDMINE_API_KEY, 'REDMINE_API_KEY is missing')
assert(process.env.REDMINE_URL, 'REDMINE_URL is missing')

module.exports = {
  debug: process.env.DEBUG,
  slackApiToken: process.env.SLACK_API_TOKEN,
  dialogFlowClientAccessToken: process.env.DIALOG_FLOW_CLIENT_ACCESS_TOKEN,
  logFile: process.env.LOG_FILE,
  logLevel: process.env.LOG_LEVEL,
  redmineApiKey: process.env.REDMINE_API_KEY,
  redmineUrl: process.env.REDMINE_URL,
  webHook: require('./webhook')
}
