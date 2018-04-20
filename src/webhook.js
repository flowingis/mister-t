'use strict'

const misterT = require('./mister-t')

module.exports.ping = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({pong: true})
  })
}

module.exports.reply = async (event, context, callback) => {
  try {
    const incoming = JSON.parse(event.body)
    callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      },
      body: JSON.stringify(await misterT.replyTo(incoming))
    })
  } catch (e) {
    console.error(e.name + ': ' + e.message)
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({error: 'Unable to process request'})
    })
  }
}
