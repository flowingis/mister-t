'use strict';

const cron = require('node-cron')
const _ = require('lodash')
const slack = require('./slack')(true)
const controller = slack.controller()
const misterT = require('./misterT')(require('./data'), require('./config'))

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

controller.hears('.*', 'direct_message', async function (bot, message) {
  try{
    const {response, processedMessage} = await misterT.replyTo(bot, message)

    if(processedMessage.nlpResponse.result.fulfillment.speech){
      bot.reply(processedMessage, processedMessage.nlpResponse.result.fulfillment.speech)
    }
    bot.reply(processedMessage, response.displayText)

  }catch (e) {
    bot.reply(message, 'Mi dispiace, non ho capito')
    console.error(e)
  }
});