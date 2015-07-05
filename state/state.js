// For saving some persistent information that isn't worth saving in mongo

var path = require('path');
var fs = require('fs');

var state = {};

var stateManager = {

  state: state,

  loadState: function() { this.state = require('./state.json'); },

  saveState: function() { fs.writeFile('./state/state.json', JSON.stringify(this.state)); }
};

module.exports = stateManager;
