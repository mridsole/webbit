"use strict";

// Export a configuration object
module.exports = {
  port: '8080',

  dataBackend: 'mongodb',

  gcloud: {
    projectId: 'webbit-991'
  },

  mongodb: {
    url_dev: 'mongodb://localhost:27017/webbit',
    url: 'mongodb://23.236.62.84:27017/mydb',
    nodeCollection: 'nodes'
  },

  webbit: {
    minReplies: 1,
    maxReplies: 4,
    minDistance: 150,
    maxDistance: 600,
    minWorld: -100000,
    maxWorld: 100000,
    defaultGetRadius: 2000,
    maxGetRadius: 30000,

    // timeout ms in between sending a watch response and waiting for a new poll request
    watchTimeout: 10000,
    // timeout ms before a watch will simply send back an empty data array
    // (this prevents automatic timeouts)
    watchIdleTimeout: 60000
  }
};
