'use strict'

const Botkit = require('botkit')

module.exports = ({debug, token}) => {
  const controller = () => Botkit.slackbot({debug})
  const spawnBot = (controller, token) => controller.spawn({token})
  const username = (userId, cb) => {
    if (!userId) {
      return cb(new Error('undefined userId'))
    }

    const bot = spawnBot(controller(debug), token)
    bot.api.users.info({user: userId}, (error, response) => {
      if (error) {
        return cb(error)
      }
      bot.destroy()
      return cb(null, `@${response.user.name}`)
    })
  }

  return {
    controller,
    spawnBot,
    username
  }
}
