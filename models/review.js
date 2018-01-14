var mongoose = require('mongoose');

var reviewModel = mongoose.model('Review', mongoose.Schema({
  location: {type: String, required: true},
  user: {type: String, required: true},
  body: {type: String, required: true},
  rating: {type: Number, required: true},
  time: {type: String, required: true}
}));