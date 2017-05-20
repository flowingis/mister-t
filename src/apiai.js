'use strict';

const apiaiService = require('apiai');
const uuid = require('node-uuid');

module.exports = function(config) {
  if (!config.token) {
    throw new Error('No api.ai token provided.');
  }

  const apiai = apiaiService(config.token);

  if (!config.minimum_confidence) {
    config.minimum_confidence = 0.5;
  }

  if (!config.sessionId) {
    config.sessionId = uuid.v1();
  }

  const middleware = {}

  middleware.receive = function(bot, message, next) {
    if(message.text) {
      const request = apiai.textRequest(message.text, {
        sessionId: config.sessionId
      })

      request.on('response', function(response){
        message.intent = response.result.metadata.intentName;
        message.entities = response.result.parameters;
        message.fulfillment = response.result.fulfillment;
        message.confidence = response.result.score;
        message.nlpResponse = response;
        next();
      });

      request.on('error', function(error) {
        next(error);
      });

      request.end();
    } else {
      next();
    }
  }

  middleware.hears = function(tests, message) {
    console.log('APIAI message: ', message)
    for (let i = 0; i < tests.length; i++) {
      if (message.intent === tests[i] &&
        message.confidence >= config.minimum_confidence) {
        return true;
      }
    }

    return false;
  };

  return middleware
}
