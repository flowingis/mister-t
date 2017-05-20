'use strict';

const moment = require('moment')
const config = require('../config')
const redmine = require('../redmine')(config.redmineUrl, config.redmineApiKey)
const ideatos = require('../ideatos')

const hummanReadableDate = function (day) {
  return moment(day).locale('it').calendar(null, {
    lastDay: '[Ieri]',
    sameDay: '[Oggi]',
    nextDay: '[Domani]',
    lastWeek: '[Lo scorso] dddd',
    nextWeek: 'dddd',
    sameElse: 'L'
  })
}

module.exports = function (controller) {

  const apiai = require('../apiai')({ token: config.apiAiToken })

  controller.middleware.receive.use(apiai.receive);
  controller.hears([ 'ask-for-timesheet' ], 'direct_message', apiai.hears, function (bot, message) {
    const day = moment(message.entities.date).format('YYYY-MM-DD')
    bot.api.users.info({ user: message.user }, (error, response) => {

        bot.startConversation(message, (err, convo) => {

        const hours = redmine.timeSheet.retrieveLog((err, hours) => {
            convo.say(`${hummanReadableDate(day)} hai segnato ${hours} ore`)
          },
          ideatos.bySlackName(`@${response.user.name}`).redmineId,
          day,
          day
        )
      })
    })
  })
}