'use strict';

const _ = require('lodash')

const ideatos = {
  // '6': '@kea',
  // '158': '@nicole-e',
  // '160': '@pietro',
  // '151': '@dennais',
  // '173': '@marco',
  // '130': '@dymissy',
  // '120': '@ricfrank',
  // '127': '@moreno',
  // '163': '@m4s0',
  // '129': '@alemazz',
  // '169': '@mazzcris',
  // '3': '@orso',
  // '170': '@rado',
  // '171': '@uochi',
  '95': '@ftassi',
  // '142': '@paolo',
  // '4': '@ciccio',
  // '124': '@vitto',
  // '176': '@edelprino'
};

module.exports.bySlackName = (slackName) => {
  for (const redmineId in ideatos) {
    if (ideatos.hasOwnProperty(redmineId)) {
        if(ideatos[redmineId] === slackName) {
          return {redmineId: redmineId, slackId: slackName};
        }
    }
  }
};

module.exports.allSlackIds = (function allSlackIds(ideatos) {
  return _.map(ideatos, (slackId) => {
    return slackId
  })
}(ideatos))