var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
// var webpackDevHelper = require('./hotReload.js');


var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/EnvironmentTest', {
  useMongoClient: true,
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var testModel = mongoose.model('Test', mongoose.Schema({
  url: String
}));

var test = new testModel({ url: 'google.com'});
test.save(function(err) {
  if (err) console.error({ msg: err });
  else console.log('Success!');
});

var app = express();

// Export our app (so that tests and bin can find it)
module.exports = app;