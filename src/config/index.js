'use strict'

const assert = require('assert')
const dotenv = require('dotenv')

dotenv.config()

assert(process.env.SLACK_API_TOKEN, 'SLACK_API_TOKEN is missing')

module.exports = {
  debug: process.env.DEBUG,
  slackApiToken: process.env.SLACK_API_TOKEN
}