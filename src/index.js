'use strict';

require('app-module-path').addPath(__dirname);
const Botkit = require('botkit');
const cron = require('node-cron');
const config = require('config');
const redmine = require('redmine')(config.redmineUrl, config.redmineApiKey);
const MisterT = require('misterT');
const users = require('ideatos');

const controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: config.slackToken,
}).startRTM(function (err, bot, payload) {
  const misterT = MisterT(controller, bot);
  misterT.appear();
  cron.schedule('50 9 * * 1-5', () => misterT.warnAboutTimeSheet(redmine.timeSheet, users), false);
});