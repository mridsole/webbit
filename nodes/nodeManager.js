var path = require('path');
var Q = require('q');
var config = require('../config');

// use underscore for _.findIndex
var _ = require('underscore');

var watchManager = require('./watchManager');

module.exports = {

  // simple utility stuff
  utils: {

    // run basic validation on a node JSON object
    validateNode: function (nodeJSON) {

      // required fields and their types
      var requiredFields = { text: typeof(''), loc: typeof([]), connect: typeof([]) };

      // check validity of field types
      for(var field in nodeJSON) {
        // if a field in nodeJSON isn't in requiredFields:
        if(requiredFields[field] == undefined) { return false; }
        // if a field in JSON is in requiredFields, but is of a different type:
        if(requiredFields[field] != typeof(nodeJSON[field])) { return false; }
      }

      // check for existence of required fields
      for(var field in requiredFields) {
        if(!nodeJSON.hasOwnProperty(field)) { return false; }
      }

      // check the validity of the connect field - all entries must be strings
      for(var i = 0; i < nodeJSON.connect; i++) {
        if(typeof(nodeJSON.connect[i]) != typeof('')) { return false; }
      }

      // check the validity of the loc field - should only be 2 number entries
      if (nodeJSON.loc.length != 2) { return false; }
      for (var i = 0; i < nodeJSON.loc; i++) {
        if (typeof(nodeJSON.loc[i]) != typeof(1)) { return false; };
      }

      return true;
    },

    // generate a mapping from _id to index in the nodes array
    nodeMap: function (nodes) {

      var nodeMap = {};

      for (var i = 0; i < nodes.length; i++) {
        nodeMap[nodes[i]._id] = i;
      }

      return nodeMap;
    }

  },

  // callback(responseJSON)
  add: function(nodeJSON, db, callback) {

    // we are assuming the node has passed basic validation (i.e. that it has
    // only the required fields of the required type). we have to perform some
    // checks:
    // 1. that the node can actually be placed here (i.e. not on top of other nodes)
    // 2. that it doesn't exceed the maximum number of connections

    // query for nodes within the maxDistance radius
    // nodes collection:
    var nodes = db.get(config.mongodb.nodeCollection);

    // first run a simple check for a min and max number of connections
    var nReplies = nodeJSON.connect.length;
    if (nReplies < config.webbit.minReplies) {
      callback( { status: 400, message: 'min replies deceeded' } );
      return;
    } else if (nReplies > config.webbit.maxReplies) {
      callback( { status: 400, message: 'max replies exceeded' } );
      return;
    }

    var minCallback = function ( err, docs) {

      // if there's any within the min range, then the addition is invalid
      if (docs.length > 0) {
        callback( { status: 400, message: 'too close to other nodes', data: docs } );
      } else {
        // now query for nodes within the max distance
        nodes.find(
          { loc: { $near: nodeJSON.loc, $maxDistance: config.webbit.maxDistance } },
          maxCallback );
      }
    };

    var maxCallback = function (err, docs) {

      // if the node has connections that aren't in this list, then the addition is invalid
      // this obviously covers things like non-existent connection references as well
      for (var i = 0; i < nodeJSON.connect.length; i++) {
        if (_.findIndex ( docs, function(docsNode) { return docsNode._id == nodeJSON.connect[i]; } ) == -1) {
          callback( { status: 400, message: 'connections too far away' } );
          return;
        }
      }

      // if we haven't returned then all connections are in range - so make a new node
      nodes.insert( nodeJSON ).success( function (data) {
        // after making the new node, notify the watch manager
        watchManager.onNewNode(data);
        callback( { status: 201, message: 'node created', data: { node: data } } );
      });

    };

    nodes.find(
      { loc: { $near: nodeJSON.loc, $maxDistance: config.webbit.minDistance } },
      minCallback );
  },

  // get all nodes within a radius
  // callback(data) where data = { nodes: Array, idMap: Object }
  nodesAround: function(loc, radius, db, callback) {

    if (radius > config.webbit.maxGetRadius) {
      callback( { status: 400, message: 'requested radius too big'} );
      return;
    }

    var nodes = db.get(config.mongodb.nodeCollection);

    var promise = nodes.find( { loc: { $near: loc, $maxDistance: radius } } );

    var utils = this.utils;

    promise.success( function (nodes) {
      callback( {
        status: 200,
        message: 'ok',
        data: { nodes: nodes, nodeMap: utils.nodeMap(nodes) }
      });
    });

  }
};
