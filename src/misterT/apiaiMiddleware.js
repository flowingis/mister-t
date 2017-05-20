'use strict';

const apiai = require('apiai')
const uuid = require('node-uuid');

module.exports = function(config) {
  if(!config.token) {
    throw new Error('No api.ai client access token provided')
  }

  if (!config.minimum_confidence) {
    config.minimum_confidence = 0.5;
  }
  if(!config.skip_bot){
    config.skip_bot = false;
  }

  if (!config.sessionId) {
    config.sessionId = uuid.v1();
  }

  const apiaiBot = apiai(config.token)
  const middleware = {};

  middleware.receive = function(bot, message, next) {
    if(config.skip_bot === true && message.bot_id !== undefined) {
      next()
      return
    }

    if(!message.text) {
      next()
      return
    }

    const request = apiaiBot.textRequest(message.text, {
      sessionId: config.sessionId
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
}
