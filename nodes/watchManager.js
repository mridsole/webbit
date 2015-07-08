var path = require('path');
var Q = require('q');
var config = require('../config');

// use underscore for _.findIndex
var _ = require('underscore');

// for generating watch IDs
var shortid = require('shortid');

var nodeManager = require('./nodeManager');

// function to call when a watch hasn't received any new nodes for a while, but still has to send a response
var onIdleTimeout = function (watchManager, watch) {
  // send a bare response back
  watchManager.sendWatchResponse(watch);
};

watchManager = {

  utils: {

    // validate a node watch request
    // not as strict as node validation - not concerned about superfluous fields,
    // only concerned with .points and .ids
    validateNewWatch : function (watch) {

      // required fields and their types
      var requiredFields = { points: typeof([]), ids: typeof([]) };

      // check for required field existence
      for (var field in requiredFields) {
        if (!watch.hasOwnProperty(field)) { return false; }
      }

      // check the validity of the points array
      for (var i = 0; i < watch.points.length; i++) {
        var loc = watch.points[i].loc;
        var radius = watch.points[i].radius;
        if (
          loc.length != 2 ||
          typeof(loc[0]) != typeof(1) ||
          typeof(loc[1]) != typeof(1) ||
          typeof(radius) != typeof(1) ) { return false; }
      }

      // check the validity of the ids array
      for (var i = 0; i < watch.ids.length; i++) {
        if (typeof(watch.ids[i]) != typeof('')) {
          return false;
        }
      }

      return true;
    },

    validateUpdateWatch: function (watch) {

      if (!this.validateNewWatch(watch)) {
        return false;
      }

      // check if ._id is valid
      if (typeof(watch._id) != typeof('')) {
        return false;
      }

      if (watchManager.watches[watch._id] == undefined) {
        return false;
      }

      return true;
    }
  },

  // store active watch data in this array
  watches: {},

  addWatch: function (watch) {

    // validate first
    var validState = this.utils.validateNewWatch(watch);

    if (!validState) { return { status: 400, message: 'requested watch invalid' }; }

    // generate and append an ID
    watch._id = shortid.generate();
    // initialize an empty array for the queued nodes to be sent to client
    watch.newNodes = [];
    // store the current pending response in the watch object
    watch.res = null;
    // state that the response is pending a reply (as opposed to a response being created)
    watch.resPending = false;
    // store in watches
    this.watches[watch._id] = watch;
    // set a timeout (we expect a poll request immediately)
    watch.timeout = setTimeout(
      function (watchManager, watch) { delete watchManager.watches[watch._id]; },
      config.webbit.watchTimeout, this, watch
    );

    return { status: 200, message: 'ok', data: { _id: watch._id } };
  },

  updateWatch: function (watchUpdate) {

    // validate first
    var validState = this.utils.validateUpdateWatch(watchUpdate);

    if (!validState) { return { status: 400, message: 'watch details invalid' }; }

    var watch = this.watches(watchUpdate._id);
    watch.points.length = 0;
    watch.ids.length = 0;

    for (var i = 0; i < watchUpdate.points.length; i++) {
      watch.points.push(watchUpdate.points[i]);
    }

    for (var i = 0; i < watchUpdate.ids.length; i++) {
      watch.points.push(watchUpdate.ids[i]);
    }

    return { status: 200, message: 'watch updated' };
  },

  // called when a get is sent to /api/watches/longpoll
  pollWatch: function (res, watch) {
    // store the response in the watch
    watch.res = res;
    watch.resPending = true;
    clearTimeout(watch.timeout);
    // start the idle timeout
    watch.idleTimeout = setTimeout(onIdleTimeout, config.webbit.watchIdleTimeout, this, watch);

    // if the backlog isn't empty, then we already have something to send
    if (watch.newNodes.length > 0) {
      this.sendWatchResponse(watch);
    }
  },

  // called when a new node is created by someone. check the node against all the
  // watches and record any matches
  onNewNode: function (node) {

    // check all of the watches
    for (var watchID in this.watches) {
      if (this.checkAgainstWatch(node, this.watches[watchID])) {
        this.submitNodeWatch(node, this.watches[watchID]);
      }
    }
  },

  sendWatchResponse: function (watch) {
    watch.res.send( { status: 200, message: 'ok', data: { nodes: watch.newNodes } } );
    watch.resPending = false;
    watch.newNodes.length = 0;
    watch.timeout = setTimeout(
      function (watchManager, watch) { delete watchManager.watches[watch._id]; },
      config.webbit.watchTimeout, this, watch
    );
    // clear the idle timeout
    clearTimeout(watch.idleTimeout);
  },

  submitNodeWatch: function (node, watch) {

    // ensure this node will be sent in the next watch response
    watch.newNodes.push(node);
    // if the node's request is pending then send it this node and all backlogged nodes
    if (watch.resPending) {
      this.sendWatchResponse(watch);
    } else { // otherwise, log the node to be sent later
      watch.newNodes.push(node);
    }
  },

  checkAgainstWatch: function (node, watch) {

    // first check: check distance from all points
    for (var i = 0; i < watch.points.length; i++) {
      var loc = watch.points[i].loc;
      var radius = watch.points[i].radius;
      if (Math.sqrt(Math.pow(loc[0] - node.loc[0], 2) + Math.pow(loc[1] - node.loc[1], 2)) <= radius) {
        return true;
      }
    }

    // second check: check if any of the node IDs link to any of the IDs in the watch
    for (var i = 0; i < node.connect; i++) {
      if (_.findIndex (watch.ids, function (id) { return id == node.connect[i]; })) {
        return true;
      }
    }

    // otherwise,
    return false;
  }

};

module.exports = watchManager;
