'use strict';

const moment = require('moment');
const _ = require('lodash');
const cron = require('node-cron');
const lastBusinessDay = require('../businessDays').last;
const redmineIdFromSlack = require('../ideatos').bySlackName;

module.exports = (controller, bot) => {

  const doTellYesterdayHours = (slackId, redmineId, retrieveLog) => {
    const day = lastBusinessDay(moment()).format('YYYY-MM-DD');

    retrieveLog(function (err, hours) {

      bot.say({
        text: `Ieri hai segnato ${hours} ore\nTeachin' fools some basic rules! `,
        channel: redmineId
      });
    }, redmineId, day, day);
  };

  const warnAboutTimeSheet = (timeSheet, users) => {
    _.forEach(users, (slackId, redmineId) => {
      doTellYesterdayHours(slackId, redmineId, timeSheet.retrieveLog)
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

  const tellUserYesterdayHours = (timesheet) => {
    controller.hears('what about yesterday', 'direct_message,direct_mention,mention', (bot, message) => {
      bot.api.users.info({user: message.user}, (error, response) => {
        const {slackId, redmineId} = redmineIdFromSlack(`@${response.user.name}`);
        doTellYesterdayHours(slackId, redmineId, timesheet.retrieveLog);
      })
    });
  };

  return {
    warnAboutTimeSheet,
    tellUserYesterdayHours,
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