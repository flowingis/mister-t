'use strict';

require('dotenv').config();

module.exports = {
  redmineApiKey: process.env.REDMINE_API_KEY,
  redmineUrl: process.env.REDMINE_URL,
  slackToken: process.env.SLACK_BOT_TOKEN,
  witServerToken: process.env.WIT_SERVER_TOKEN
};
