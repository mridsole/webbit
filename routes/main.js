"use strict";

var express = require('express');
var path = require('path');

var router = express.Router();

// Serve the main page
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = router;
