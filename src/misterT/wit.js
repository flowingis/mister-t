'use strict';
const Wit = require('node-wit').Wit;

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    context.conversation().say(text);
  },
  orderPizza({context, entities}) {
      context.delivery = "Alle 4";
      return context;
  },
  getHours({context, entities}) {
    const when = firstEntityValue(entities, 'datetime');

    if(when) {
      context.hours = 8;
      delete context.missingWhen;
    } else {
      context.missingWhen = true;
      delete context.hours;
    }

    return context
  },
}

module.exports = function(accessToken) {
  return new Wit({accessToken, actions});
}