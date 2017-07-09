'use strict';

const cron = require('node-cron')
const _ = require('lodash')
const slack = require('./slack')(true)
const controller = slack.controller()
const middleware = require('./misterT/apiaiMiddleware')(require('./config'))
const misterT = require('./misterT')(require('./data'))

controller.middleware.receive.use(middleware.receive)
slack.spawnBot(controller).startRTM(function (err, bot, payload) {

    cron.schedule('50 9 * * 1-5', async () => {
      try {
        const warnings = await misterT.warnAboutMissingTimesheet()
        if (warnings) {
          warnings.forEach(({ text, channel }) => {
            bot.say({ text, channel })
          })
        }
      } catch (e) {
        console.error(e)
      }
    })
  }
)

controller.hears('.*', 'direct_message', function (bot, message) {
  const replyTo = misterT.replyTo(message.nlpResponse.result.action)
  replyTo(message.nlpResponse)
    .then(response => {
      if(message.fulfillment.speech){
        bot.reply(message, message.fulfillment.speech)
      }
      bot.reply(message, response.displayText)
    })
    .catch((e) => {
      bot.reply(message, 'Mi dispiace, non ho capito')
    })
});