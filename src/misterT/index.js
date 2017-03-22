'use strict';

const moment = require('moment');
const _ = require('lodash-node');
const cron = require('node-cron');
const lastBusinessDay = require('business-days').last;

module.exports = (controller, bot) => {
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

  const appear = () => {
    controller.hears([ 'uptime', 'identify yourself', 'who are you', 'what is your name' ],
      'direct_message,direct_mention,mention', function (bot, message) {

        const uptime = formatUptime(process.uptime());

        bot.reply(message,
          ':robot_face: I am <@' + bot.identity.name +
          '>. I have kicked asses for ' + uptime + ' now');

      });
  };

  return {
    warnAboutTimeSheet,
    appear
  }
};


function formatUptime(uptime) {
  let unit = 'second';
  if (uptime > 60) {
    uptime = uptime / 60;
    unit = 'minute';
  }
  if (uptime > 60) {
    uptime = uptime / 60;
    unit = 'hour';
  }
  if (uptime != 1) {
    unit = unit + 's';
  }

  uptime = uptime + ' ' + unit;
  return uptime;
}