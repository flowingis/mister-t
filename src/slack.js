'use strict';

const Botkit = require('botkit');
const config = require('./config/config')

module.exports = (debug) => {
  const controller = () => {
    return Botkit.slackbot({debug});
  }

  const spawnBot = controller => {
    return controller.spawn({token: config.slackToken})
  }

  const retrieveUsername = (user, cb) => {
    const bot = spawnBot(controller(debug))
    bot.api.users.info({user}, (error, response) => {
      if(error) {
        cb(error)
      }
      bot.destroy()
      cb(false, `@${response.user.name}`)
    })
  }

  return {
    controller,
    spawnBot,
    retrieveUsername
  }
}