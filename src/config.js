'use strict';

require('dotenv').config();

module.exports = {
  redmineApiKey: process.env.REDMINE_API_KEY,
  redmineUrl: process.env.REDMINE_URL,
  slackToken: process.env.SLACK_BOT_TOKEN,
  apiAiToken: process.env.APIAI_CLIENT_ACCESS_TOKEN,
  webhookPort: process.env.PORT || 5000
};
