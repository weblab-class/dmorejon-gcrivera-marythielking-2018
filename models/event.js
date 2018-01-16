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

const event = ((eventModel) => {
  let that = {};

  that.getEvent = async (id) => {
    try {
      const newEvent = await eventModel.findOne({_id: id});
      if (newEvent === null) {throw {msg: 'Event does not exist.'}}
    } catch(e) {
      throw e;
    }
  }

  that.getEventsByGreenspace = async (greenspaceid) => {
    try {
      const events = await eventModel.find({greenspace: greenspaceid});
      if (events.length == 0) {throw {msg: 'There are no events for this greenspace.'}}
    } catch(e) {
      throw e;
    }
  }

  that.getEventsByUser = async (userid) => {
    try {
      const events = await eventModel.find({participants: userid});
      if (events.length == 0) {throw {msg: 'There are no events for this user.'}}
    } catch(e) {
      throw e;
    }
  }

  Object.freeze(that);
  return that;

})(eventModel);

module.exports = event;