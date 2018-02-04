"use strict"

const config = require('./config/config')
const Botkit = require('botkit')
const misterT = require('./mister-t')(require('./data'), require('./config/config'))
const logger = require('./logger')()

const controller = Botkit.slackbot()

const bot = controller.spawn({
  token: config.slackApiToken
})

bot.startRTM(function (err, bot, payload) {
  if(err) {
    throw new Error('Could not connect to slack')
  }
})
controller.hears(['Ciao'], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
  bot.reply(message,'Ciaone a te, come stai?');
})

controller.hears('.*', 'direct_message', async function (bot, message) {
  try{
    const {response, processedMessage} = await misterT.replyTo(bot, message)

    if(processedMessage.nlpResponse.result.fulfillment.speech){
      bot.reply(processedMessage, processedMessage.nlpResponse.result.fulfillment.speech)
    }

    if(response) {
      bot.reply(processedMessage, response.displayText)
    }

  }catch (e) {
    bot.reply(message, 'Mi dispiace, non ho capito')
    logger.error(e)
  }
});