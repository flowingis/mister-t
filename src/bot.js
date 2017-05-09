'use strict';

const config = require('./config')
const Botkit = require('botkit');

const controller = Botkit.slackbot({debug: true});

require('./skills/hearAskForTimesheet')(controller)

controller
  .spawn({token: config.slackToken})
  .startRTM()
