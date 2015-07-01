"use strict";

// Export a configuration object
module.exports = {
  port: '8080',

  dataBackend: 'mongodb';

  gcloud: {
    projectId: 'webbit-991';
  },

  mongodb: {
    url: '...',
    collection: '...'
  }
};
