"use strict";

// define a REST API for the client to call to obtain node data for drawing
var express = require('express');
var path = require('path');
var nodeManager = require('../nodes/nodeManager');

var router = express.Router();

// in app.js, this module is applied '/api', so all URIs are relative to that

// get all nodes in the graph (obviously wont be in final implementation - just for debugging)
router.get('/nodes/all', function (req, res) {

  var nodes = req.db.get('nodes');

  nodes.find({}, function(err, docs){
    res.send(docs);
  });
});

// get all nodes around a point for a certain radius, parameters x and y
// i.e. /nodes?x=0&y=0&r=100
// also return a mapping from ID to index
router.get('/nodes/around', function (req, res) {

  // extract from query
  var x = Number(req.query.x);
  var y = Number(req.query.y);
  var r = Number(req.query.r);

  nodeManager.nodesAround([x, y], r, req.db, function (data) {
    res.send(data);
  });
});

// create a new node
router.post('/nodes/new', function (req, res) {

  var node_req = req.body;

  // simple validation:
  var validState = nodeManager.utils.validateNode(node_req);

  if(!validState) {
    res.status(400);
    res.send({ status: 400, message: 'bad request' });
    return;
  }

  var addCallback = function(response) {
    res.send(response);
  };

  // if it passes the simple validation, send it to node.add for the necessary processing
  nodeManager.add(node_req, req.db, addCallback);



  // TO DO:
  // - more validation (posiition, max nodes, distance, etc)
  // - add author ID
  // uc.insert(node_req, function(err, doc) {
  //
  //   if(err != null) {
  //     res.status(500);
  //     res.send({ status: 500, message: err });
  //     return;
  //   }
  //
  //   var node_res = node_req;
  //
  //   res.status(201);
  //   res.send({ status:201, message: 'new node created', response: node_res });
  // });

});

// add a new node

module.exports = router;
