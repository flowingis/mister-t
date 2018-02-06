'use strict'

const assert = require('assert')
const dotenv = require('dotenv')

dotenv.config()

assert(process.env.WEBHOOK_LISTEN_PORT, 'WEBHOOK_LISTEN_PORT is missing')

module.exports = {
  listenPort: process.env.WEBHOOK_LISTEN_PORT
}
