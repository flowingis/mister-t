'use strict'

const Botkit = require('botkit')

module.exports = ({debug, token}) => {
  const controller = () => Botkit.slackbot({debug})
  const spawnBot = (controller, token) => controller.spawn({token})
  const username = (user, cb) => {
    if (!user) {
      return cb(new Error('undefined user'))
    }

    const bot = spawnBot(controller(debug), token)
    bot.api.users.info({user}, (error, response) => {
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
