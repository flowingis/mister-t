'use strict';

const apiai = require('apiai')
const uuid = require('node-uuid');
const _ = require('lodash')

module.exports = function(config) {
  let sessions = {}

  if(!config.apiAiToken) {
    throw new Error('No api.ai client access token provided')
  }

  if (!config.minimum_confidence) {
    config.minimum_confidence = 0.5;
  }
  if(!config.skip_bot){
    config.skip_bot = true;
  }

  if (config.sessions) {
    sessions = _.cloneDeep(config.sessions)
  }

  const apiaiBot = apiai(config.apiAiToken)
  const middleware = {};

  middleware.receive = function(bot, message, next) {

    if (message.type !== "message") {
      next()
      return
    }

    if(config.skip_bot === true && message.user === bot.identity.id) {
      next()
      return
    }

    if(!message.text) {
      next()
      return
    }

    const channel = message.channel;
    if (!(channel in sessions)) {
      sessions[channel] = {
        sessionId: uuid.v1(),
        contexts: []
      };
    }

    const request = apiaiBot.textRequest(message.text, {
      sessionId: _.get(sessions, `${channel}.sessionId`),
      contexts: _.get(sessions, `${channel}.contexts`)
    });

    request.on('response', function(response) {
      message.intent = response.result.metadata.intentName;
      message.entities = response.result.parameters;
      message.fulfillment = response.result.fulfillment;
      message.confidence = response.result.score;
      message.contexts = response.result.contexts;
      _.set(sessions, `${channel}.contexts`, _.get(response, 'result.contexts'))
      message.nlpResponse = response;
      next();
    })

    request.on('error', function(error) {
      next(error);
    });

    request.end();
  }

  return middleware
}
