"use strict";

// define a REST API for the client to call to obtain node data for drawing
var express = require('express');
var path = require('path');

var router = express.Router();


// utility to validate data for a new node submission
// only basic validation - doesn't check for:
// - existence of 'connect' node ids
// - whether position of the node is possible
// - max number of connect ids
// - etc.
function validate_node(nodeJSON) {

  // required fields and their types
  var requiredFields = { text: typeof(''), gx: typeof(2), gy: typeof(2), connect: typeof([]) }

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

  // check the validity of the connect field - all entries must be numbers
  for(var i = 0; i < nodeJSON.connect; i++) {
    if(typeof(id) != typeof(1)) { return false; }
  }

  return true;

}

// in app.js, this module is applied '/api', so all URIs are relative to that

// get all nodes in the graph (obviously wont be in final implementation)
router.get('/all', function(req, res) {

  var uc = req.db.get('usercollection');

  uc.find({}, function(err, docs){
    res.send(docs);
  });
});

// create a new node
router.post('/new', function(req, res) {

  var node_req = req.body;

  // validation:
  var validState = validate_node(node_req);

  if(!validState) {
    res.status(500);
    res.send({ status: 500, message: 'bad request' });
    return;
  }

  var uc = req.db.get('usercollection');

  // TO DO:
  // - more validation (posiition, max nodes, distance, etc)
  // - add author ID
  uc.insert(node_req, function(err, doc) {

    if(err != null) {
      res.status(500);
      res.send({ status: 500, message: err });
      return;
    }

    var node_res = node_req;

    res.status(201);
    res.send({ status:201, message: 'new node created', response: node_res });
  });

});

// add a new node

module.exports = router;
