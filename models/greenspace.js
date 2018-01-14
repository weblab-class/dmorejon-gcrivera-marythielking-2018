var mongoose = require('mongoose');

var greenspaceModel = mongoose.model('Greenspace', mongoose.Schema({
  location: [{type: Number, required: true, unique: true}],
  name: {type: String, required: true},
  events: [{type: String}],
  reviews: [{type: String}]
}));