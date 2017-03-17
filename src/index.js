'use strict';

const Botkit = require('botkit');
const moment = require('moment');
const _ = require('lodash-node');
const cron = require('node-cron');
const config = require('./config');
const redmine = require('./redmine')(config.redmineUrl, config.redmineApiKey);
const users = require('./ideatos');

const controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: config.slackToken,
}).startRTM(function (err, bot, payload) {

  cron.schedule('50 9 * * 1-5', function () {
    _.forEach(users, function (slackId, redmineId) {
      const day = moment().add(-1, 'days').format('YYYY-MM-DD');

      redmine.timeSheet.retrieveLog(function (err, hours) {

        bot.say({
          text: `Ieri hai segnato ${hours} ore\nTeachin' fools some basic rules! `,
          channel: slackId// a valid slack channel, group, mpim, or im ID
        });
      }, redmineId, day, day);
    })
  });
});