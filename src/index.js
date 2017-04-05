'use strict';

const Botkit = require('botkit');
const cron = require('node-cron');
const config = require('./config');
const MisterT = require('./misterT');
const users = require('./ideatos').all;

const controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: config.slackToken,
}).startRTM(function (err, bot, payload) {
  const misterT = MisterT(controller, config);
  misterT.appear(controller);
  cron.schedule('50 9 * * 1-5', () => misterT.warnAboutTimeSheet(bot, users));
});