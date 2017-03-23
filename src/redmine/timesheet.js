'use strict';

const request = require('request');
const _ = require('lodash');

module.exports = function(endPoint, apiKey){
  function retrieveLog (cb, user, from, to) {
    const url = `${endPoint}/time_entries.json?key=${apiKey}&user_id=${user}&from=${from}&to=${to}&limit=100`;

    request(url, function (error, response, body) {
      if(error) {
        console.log(error)
      }

      const hours = _.reduce(JSON.parse(body)[ 'time_entries' ], function (sum, entry) {
        return sum + entry[ 'hours' ]
      }, 0);
      cb(null, hours)
    });
  }

  return {
    retrieveLog: retrieveLog
  }

};
