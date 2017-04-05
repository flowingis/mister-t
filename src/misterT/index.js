'use strict';

const moment = require('moment');
const _ = require('lodash');
const cron = require('node-cron');
const lastBusinessDay = require('../businessDays').last;

module.exports = (controller, params) => {

  const redmine = require('../redmine')(params.redmineUrl, params.redmineApiKey);
  const wit = require('./wit')(params.witServerToken)
  const receive = require('./receiveMiddleware')(wit)
  controller.middleware.receive.use(receive);

  return {
    warnAboutTimeSheet(bot, users) {
      _.forEach(users, (slackId, redmineId) => {
        const day = lastBusinessDay(moment()).format('YYYY-MM-DD');
        redmine.timeSheet.retrieveLog((err, hours) => {
          if(hours < 8) {
            bot.say({
              text: `Yesterday you have logged ${hours} hours\nTeachin' fools some basic rules! `,
              channel: slackId
            });
          }
        }, redmineId, day, day);
      })
    },

    appear(controller) {
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