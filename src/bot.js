'use strict';

const slack = require('./slack')(true)
const controller = slack.controller()
const middleware = require('./misterT/apiaiMiddleware')(require('./config'))
const misterT = require('./misterT')(require('./data'))

controller.middleware.receive.use(middleware.receive)
slack.spawnBot(controller).startRTM()

controller.hears('.*','direct_message',function(bot, message) {
  const replyTo = misterT.replyTo(message.nlpResponse.result.action)
  replyTo(message.nlpResponse)
    .then(response => {
      bot.reply(message, response.displayText)
    })
    .catch((e) => {
      bot.reply(message, 'Mi dispiace, non ho capito')
    })
});