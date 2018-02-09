'use strict'

const config = require('../../../config/config')
const ideatos = require('../../../ideatos')
const workEntries = require('../../../redmine/getWorkEntries')(config)

module.exports = function (user, from, to) {
  const redmineUserId = ideatos.bySlackName(user).redmineId
  return workEntries(redmineUserId, from, to)
}
