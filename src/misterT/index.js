'use strict';
const apiai = require('apiai')
const uuid = require('node-uuid');
const _ = require('lodash')
const skills = require('./skills')

let sessions = {}

module.exports = function (data, config) {
  return {
    replyTo: (action) => skills(action)(data),
    warnAboutMissingTimesheet: require('./skills/warnAboutMissingTimesheet')(data),
    process
  }
}

function process (config, bot, message) {
  return new Promise((resolve, reject) => {
    if (!config.apiAiToken) {
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

    const apiaiBot = apiai(config.apiAiToken)

    if (message.type !== "message") {
      resolve()
    }

    if (config.skip_bot === true && message.user === bot.identity.id) {
      resolve()
    }

    if (!message.text) {
      resolve()
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
      message.intent = response.result.metadata.intentName;
      message.entities = response.result.parameters;
      message.fulfillment = response.result.fulfillment;
      message.confidence = response.result.score;
      message.contexts = response.result.contexts;
      _.set(sessions, `${channel}.contexts`, _.get(response, 'result.contexts'))
      message.nlpResponse = response;

      resolve(message)
    })

    request.on('error', function (error) {
      reject(error)
    });

    request.end();
  })
}