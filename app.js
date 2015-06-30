// serverside node.js code

"use strict";
var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('yer');
});

// serving directories
app.use(express.static('views'));
app.use(express.static('node_modules/angular'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.static('node_modules/jquery/dist'));
app.use(express.static('node_modules/underscore'));

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('The server is listening at http://%s:%s', host, port);;
})
