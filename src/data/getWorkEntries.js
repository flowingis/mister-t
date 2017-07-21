'use strict';

const config = require('../config')
const ideatos = require('../ideatos')
const request = require('request');
const _ = require('lodash');
const logger = require('../logger')()
module.exports = function (user, from, to) {
  const redmineUserId = ideatos.bySlackName(user).redmineId
  return workEntries(redmineUserId, from, to)
}

function workEntries (user, from, to) {
  return new Promise((resolve, reject) => {
    const url = `${config.redmineUrl}/time_entries.json?key=${config.redmineApiKey}&user_id=${user}&from=${from}&to=${to}&limit=100`;
    request(url, function (error, response, body) {

      if (error) {
        logger.error(error, 'Redmine error')
        reject(error)
      }

      const timeEntries = JSON.parse(body)[ 'time_entries' ]
      if (timeEntries.length === 0) {
        resolve([])
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

          if (logs.length === timeEntries.length) {
            resolve(logs)
          }
        })
      })
    });
  })
}

function retrieveIssue (issueId, done) {
  const url = `${config.redmineUrl}/issues/${issueId}.json?key=${config.redmineApiKey}`;

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