const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const webpackDevHelper = require('./hotReload.js');


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/greenspace', {
  useMongoClient: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Mongodb test
const testModel = mongoose.model('Test', mongoose.Schema({
  url: String
}));

const test = new testModel({ url: 'google.com'});

/* jshint ignore:start */
(async () => {
  try {
    await test.save();
    console.log('Success!');
  } catch(err) {
    console.error({ msg: err });
  }
})();
/* jshint ignore:end */

const app = express();

// Serve static assets from the public folder in project root
app.use(express.static('public'));

// Auto direct to homepage
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

// Open app on specified port (default 3000)
app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
});

// Export our app (so that tests and bin can find it)
module.exports = app;