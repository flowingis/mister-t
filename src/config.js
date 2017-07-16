'use strict';

require('dotenv').config();
const path = require('path')

module.exports = {
  debug: process.env.DEBUG,
  redmineApiKey: process.env.REDMINE_API_KEY,
  redmineUrl: process.env.REDMINE_URL,
  slackToken: process.env.SLACK_BOT_TOKEN,
  apiAiToken: process.env.APIAI_CLIENT_ACCESS_TOKEN,
  webhookPort: process.env.PORT || 5000,
  logFile: process.env.LOG_FILE || path.join(__dirname, '..', 'var', 'log', 'mister-t.log'),
  logLevel: process.env.LOG_LEVEL || 'debug'
};
