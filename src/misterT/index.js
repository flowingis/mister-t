'use strict';

const moment = require('moment');
const _ = require('lodash-node');
const cron = require('node-cron');

module.exports = (bot) => {
  const warnAboutTimeSheet = (timeSheet, users) => {
    _.forEach(users, function (slackId, redmineId) {
      const day = moment().add(-1, 'days').format('YYYY-MM-DD');

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

