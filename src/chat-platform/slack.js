'use strict'

const Botkit = require('botkit')
const APIAI_CONSOLE_FAKE_USER = '@ftassi'

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

  const sender = (slackRequest) => {
    return new Promise((resolve, reject) => {
      if (!slackRequest) {
        return resolve(APIAI_CONSOLE_FAKE_USER)
      }

      const source = slackRequest.source

      if (!source || !source.startsWith('slack')) {
        return reject(new Error(`Invalid source: expected slack got ${source}`))
      }

      username(slackRequest.data.event.user, (error, user) => {
        if (error) {
          reject(new Error('Unable to retrieve user'))
          return
        }

        resolve(user)
      })
    })
  }

  return {
    controller,
    spawnBot,
    sender
  }
}
