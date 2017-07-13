'use strict';

const moment = require('moment')
const _ = require('lodash')
const lastBusinessDay = require('../../businessDays').last

module.exports = ({ getChatUsers, getWorkEntries }) => {
  return async function warnAboutMissingTimesheet () {

    const day = lastBusinessDay(moment()).format('YYYY-MM-DD');
    const users = await getChatUsers()

    const workEntries = users.map(slackId => {
      return (async function () {
        const workEntries = await getWorkEntries(slackId, day, day)
        const hours = _.reduce(workEntries, function (sum, entry) {
          return sum + entry[ 'hours' ]
        }, 0);

        if (hours < 8) {
          return {
            text: `Ieri ha segnato solo ${hours} ore\n, non è che ti sei dimenticato di qualcosa?`,
            channel: slackId
          }
        }
      }())
    })

    return _.filter(await Promise.all(workEntries))
  }
}