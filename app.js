const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const webpackDevHelper = require('./hotReload.js');


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/EnvironmentTest', {
  useMongoClient: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const testModel = mongoose.model('Test', mongoose.Schema({
  url: String
}));

const test = new testModel({ url: 'google.com'});

(async () => {
  try {
    await test.save()
    console.log('Success!');
  } catch(err) {
    console.error({ msg: err });
  }
})();

const app = express();

// Export our app (so that tests and bin can find it)
module.exports = app;