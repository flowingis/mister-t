'use strict';

const config = require('../../config')
const redmine = require('../../redmine')(config.redmineUrl, config.redmineApiKey);
const bySlackName = require('../../ideatos').bySlackName;
const moment = require('moment');

module.exports = {
  getHours({context, entities}) {

    const when = firstEntityValue(entities, 'datetime');
    if (when) {
      const day = moment(when).format('YYYY-MM-DD')
      return new Promise((resolve, reject) => {
        redmine.timeSheet.retrieveLog((err, hours) => {
          context.hours = hours;
          context.when = moment(when).locale('it').format('l')
          delete context.missingWhen;
          resolve(context)
        }, bySlackName(context.user).redmineId, day, day);
      })
    } else {
      context.missingWhen = true;
      delete context.hours;

      return context
    }
  },
}

function firstEntityValue (entities, entity) {
  const val = entities && entities[ entity ] &&
    Array.isArray(entities[ entity ]) &&
    entities[ entity ].length > 0 &&
    entities[ entity ][ 0 ].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
}