'use strict'

const config = require('./config/config')
const misterT = require('./mister-t')(require('./data'))
const logger = require('./logger')()
const slack = require('./chat-platform/slack')({debug: config.debug, token: config.slackApiToken})

const controller = slack.controller()
const bot = slack.spawnBot(controller, config.slackApiToken)

bot.startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to slack')
  }
})

controller.hears(['Ciao'], ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
  bot.reply(message, 'Ciaone a te, come stai?')
})

// controller.hears('.*', 'direct_message', async function (slackBot, message) {
//   try {
//     misterT.process({slackBot, message})
//   } catch (e) {
//     slackBot.reply(message, 'Mi dispiace, non ho capito')
//     logger.error(e)
//   }
// })
