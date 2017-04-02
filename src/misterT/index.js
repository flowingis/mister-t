'use strict';

const moment = require('moment');
const _ = require('lodash');
const cron = require('node-cron');
const lastBusinessDay = require('../businessDays').last;
const redmineIdFromSlack = require('../ideatos').bySlackName;

module.exports = (controller, bot) => {

  return {
    warnAboutTimeSheet(timeSheet, users) {
      _.forEach(users, (slackId, redmineId) => {
        const day = lastBusinessDay(moment()).format('YYYY-MM-DD');
        timeSheet.retrieveLog((err, hours) => {
		  if(hours < 8) {
            bot.say({
              text: `Yesterday you have logged ${hours} hours\nTeachin' fools some basic rules! `,
              channel: slackId
            });
          }
        }, redmineId, day, day);
      })
    },

    tellUserYesterdayHours(timeSheet) {
      controller.hears('what about yesterday', 'direct_message,direct_mention,mention', (bot, message) => {
        bot.api.users.info({ user: message.user }, (error, response) => {
          const { redmineId } = redmineIdFromSlack(`@${response.user.name}`);
          const day = lastBusinessDay(moment()).format('YYYY-MM-DD');
          timeSheet.retrieveLog((err, hours) => {
            bot.reply(message, `Yesterday you have logged ${hours} hours\nTeachin' fools some basic rules!`)
          }, redmineId, day, day);
        })
      });
    },

    appear() {
      controller.hears([ 'uptime', 'identify yourself', 'who are you', 'what is your name' ],
        'direct_message,direct_mention,mention', function (bot, message) {

          const uptime = formatUptime(process.uptime());

          bot.reply(message,
            ':robot_face: I am <@' + bot.identity.name +
            '>. I have kicked asses for ' + uptime + ' now');
        });
    }
  }
};

function formatUptime (uptime) {
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