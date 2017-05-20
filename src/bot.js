'use strict';

const slack = require('./slack')
const controller = slack.controller(true)

slack.bot().startRTM()