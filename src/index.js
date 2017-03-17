'use strict';

const Botkit = require('botkit');
const config = require('./config');
const redmine = require('./redmine')(config.redmineUrl, config.redmineApiKey);
const misterT = require('./misterT');
const users = require('./ideatos');

const controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: config.slackToken,
}).startRTM(function (err, bot, payload) {
  cron.schedule('50 9 * * 1-5', () => misterT(bot).warnAboutTimeSheet(redmine.timeSheet, users), false);
});