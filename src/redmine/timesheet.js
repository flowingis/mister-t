'use strict';

const request = require('request');
const _ = require('lodash');

module.exports = function(endPoint, apiKey){
  return {
    retrieveLog: retrieveLog
  }

  function retrieveLog (user, from, to, done) {
    const url = `${endPoint}/time_entries.json?key=${apiKey}&user_id=${user}&from=${from}&to=${to}&limit=100`;

    request(url, function (error, response, body) {
      if(error) {
        done(error)
      }

      const timeEntries = JSON.parse(body)[ 'time_entries' ]
      if(timeEntries.length === 0) {
        done(null, [])
      }

      let logs = []
      timeEntries.forEach(entry => {

        retrieveIssue(_.get(entry, 'issue.id'), (error, issue) => {
          logs.push({
            date: entry.spent_on,
            project: _.get(entry, 'project.name'),
            hours: _.get(entry, 'hours'),
            issue: {
              id: _.get(entry, 'issue.id'),
              name: issue.subject
            }
          })

          if(logs.length  === timeEntries.length) {
            done(null, logs)
          }
        })
      })
    });
  }

  function retrieveIssue(issueId, done) {
    const url = `${endPoint}/issues/${issueId}.json?key=${apiKey}`;

    request(url, function (error, response, body) {
      if (error) {
        done(error)
      }

      const issue = JSON.parse(body).issue
      done(
        null,
        {
          id: issue.id,
          subject: issue.subject
        }
      )
    })
  }
};