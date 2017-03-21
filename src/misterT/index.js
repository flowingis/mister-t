'use strict';

const moment = require('moment');
const _ = require('lodash-node');
const cron = require('node-cron');
const lastBusinessDay = require('business-days').last;

module.exports = (bot) => {
  const warnAboutTimeSheet = (timeSheet, users) => {
    _.forEach(users, function (slackId, redmineId) {
      const day = lastBusinessDay(moment()).format('YYYY-MM-DD');

      timeSheet.retrieveLog(function (err, hours) {

        bot.say({
          text: `Ieri hai segnato ${hours} ore\nTeachin' fools some basic rules! `,
          channel: redmineId
        });
      }, redmineId, day, day);
    })
  };

  return { warnAboutTimeSheet }
};

