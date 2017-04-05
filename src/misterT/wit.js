'use strict';

const extend = require('util')._extend;
const Wit = require('node-wit').Wit;

const actions = extend({send}, require('./actions'))

module.exports = function (accessToken) {
  return new Wit({ accessToken, actions });
}

function send(request, response) {
  const { sessionId, context, entities } = request;
  const { text, quickreplies } = response;
  context.conversation().say(text);
}