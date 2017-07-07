'use strict';

const apiai = require('apiai')
const uuid = require('node-uuid');

module.exports = function(config) {
  if(!config.apiAiToken) {
    throw new Error('No api.ai client access token provided')
  }

  if (!config.minimum_confidence) {
    config.minimum_confidence = 0.5;
  }
  if(!config.skip_bot){
    config.skip_bot = true;
  }

  if (!config.sessions) {
    config.sessions = {};
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
    if (!(channel in config.sessions)) {
      config.sessions[channel] = uuid.v1();
    }

    console.log('SESSION_ID', config.sessions[channel])
    const request = apiaiBot.textRequest(message.text, {
      sessionId: config.sessions[channel]
    });

    request.on('response', function(response) {
      message.intent = response.result.metadata.intentName;
      message.entities = response.result.parameters;
      message.fulfillment = response.result.fulfillment;
      message.confidence = response.result.score;
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
