'use strict';
const apiai = require('apiai')
const uuid = require('node-uuid');
const _ = require('lodash')
const skills = require('./skills')
const logger = require('../logger')()

let sessions = {}

module.exports = function (data, config) {

  if (!config.dialogFlowClientAccessToken) {
    throw new Error('No api.ai client access token provided')
  }

  if (!config.minimum_confidence) {
    config.minimum_confidence = 0.5;
  }

  if (!config.skip_bot) {
    config.skip_bot = true;
  }

  if (config.sessions) {
    sessions = _.cloneDeep(config.sessions)
  }


  return {
    replyTo: async (bot, message) => {
      logger.debug(message, 'Received message')

      const processedMessage = await process(config, bot, message)
      logger.debug(processedMessage, 'Natural language parsed')
      
      const response = await skills(processedMessage.nlpResponse.result.action)(data)(processedMessage.nlpResponse)
      logger.debug(response, 'Response elaborated')

      return {response, processedMessage}
    },
    warnAboutMissingTimesheet: require('./skills/warnAboutMissingTimesheet')(data),
  }
}

function process (config, bot, message) {
  return new Promise((resolve, reject) => {
    const apiaiBot = apiai(config.dialogFlowClientAccessToken)

    if (!(message.type === "message" || message.type === 'direct_message')) {
      return resolve()
    }

    if (config.skip_bot === true && message.user === bot.identity.id) {
      return resolve()
    }

    if (!message.text) {
      return resolve()
    }

    const channel = message.channel;
    if (!(channel in sessions)) {
      sessions[ channel ] = {
        sessionId: uuid.v1(),
        contexts: []
      };
    }

    const request = apiaiBot.textRequest(message.text, {
      sessionId: _.get(sessions, `${channel}.sessionId`),
      contexts: _.get(sessions, `${channel}.contexts`)
    });

    request.on('response', function (response) {
      message.nlpResponse = _.cloneDeep(response);
      _.set(sessions, `${channel}.contexts`, _.get(response, 'result.contexts'))

      resolve(message)
    })

    request.on('error', function (error) {
      reject(error)
    });

    request.end();
  })
}