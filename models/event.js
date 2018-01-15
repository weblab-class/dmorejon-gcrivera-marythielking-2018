var mongoose = require('mongoose');

var eventModel = mongoose.model('Event', mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  starttime: {type: String, required: true},
  endtime: {type: String, required: true},
  greenspace: {type: String, required: true},
  host: {type: String, required: true},
  participants: [{type: String}]
}));