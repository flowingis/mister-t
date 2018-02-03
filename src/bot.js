"use strict"

const config = require('./config')
const Botkit = require('botkit')

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