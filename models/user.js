var mongoose = require('mongoose');

var userModel = mongoose.model('User', mongoose.Schema({
  fbid: {type: Number, required: true, unique: true},
  displayname: {type: String, required: true},
  username: {type: String, required: true}, // TODO: possibly remove required
  email: {type: String, required: true} // TODO: possibly remove required
}));