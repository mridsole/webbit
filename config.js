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
    minDistance: 60,
    maxDistance: 300,
    minWorld: -100000,
    maxWorld: 100000,
    defaultGetRadius: 2000,
    maxGetRadius: 3000
  }
};
