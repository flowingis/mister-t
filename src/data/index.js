'use strict';

module.exports = {
  getChatUsers: () => Promise.resolve(require('../ideatos').allSlackIds),
  getUser: require('./getUser'),
  getWorkEntries: require('./getWorkEntries')
}
