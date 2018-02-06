'use strict'

const slack = require('../chat-platform/slack')({debug: true})

module.exports = function getUser (request) {
  return new Promise((resolve, reject) => {
    const slackRequest = request.originalRequest
    if (!slackRequest) {
      const APIAI_CONSOLE_FAKE_USER = '@ftassi'
      resolve(APIAI_CONSOLE_FAKE_USER)
      return
    }

    const source = slackRequest.source

    if (!source.startsWith('slack')) {
      reject(new Error(`Invalid source: expected slack got ${source}`))
      return
    }

    slack.username(slackRequest.data.user, (error, user) => {
      if (error) {
        reject(new Error('Unable to retrieve user'))
        return
      }

      resolve(user)
    })
  })
}
