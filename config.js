"use strict";

// Export a configuration object
module.exports = {
  port: '8080',

  dataBackend: 'mongodb';

  gcloud: {
    projectId: 'webbit-991';
  },

  mongodb: {
    url: 'mongodb://23.236.62.84:27017/mydb',
    collection: 'nodes'
  }
};
