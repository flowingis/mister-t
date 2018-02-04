'use strict';

const Botkit = require('botkit');

module.exports = ({debug}) => {
  const controller = () => Botkit.slackbot({debug})
  const spawnBot = (controller, token) => controller.spawn({token})
  const username = (user, cb) => {
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
    username
  }
}