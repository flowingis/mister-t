'use strict'

const assert = require('assert')

assert(process.env.SLACK_API_TOKEN, 'SLACK_API_TOKEN is missing')
assert(process.env.REDMINE_API_KEY, 'REDMINE_API_KEY is missing')
assert(process.env.REDMINE_URL, 'REDMINE_URL is missing')

module.exports = {
  debug: process.env.DEBUG,
  slackApiToken: process.env.SLACK_API_TOKEN,
  logLevel: process.env.LOG_LEVEL,
  redmineApiKey: process.env.REDMINE_API_KEY,
  redmineUrl: process.env.REDMINE_URL
}
