'use strict';

const config = require('../config')

module.exports = function(controller) {

  const apiai = require('../apiai')({token: config.apiAiToken})

  controller.middleware.receive.use(apiai.receive);
  controller.hears(['ask-for-timesheet'], 'direct_message', apiai.hears, function(bot, message){
    //recupero timesheet e rispondo
  })
}
