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
      return newEvent;
    } catch(e) {
      throw e;
    }
  }

  that.getEventsByGreenspace = async (greenspaceid) => {
    try {
      const events = await eventModel.find({greenspace: greenspaceid});
      if (events.length == 0) {throw {msg: 'There are no events for this greenspace.'}}
      return events;
    } catch(e) {
      throw e;
    }
  }

  that.getEventsByUser = async (userid) => {
    try {
      const events = await eventModel.find({participants: userid});
      if (events.length == 0) {throw {msg: 'There are no events for this user.'}}
      return events;
    } catch(e) {
      throw e;
    }
  }

  that.createEvent = async (eventData, host) => {
    if (!eventData.participants.includes(host)) {
      eventData.participants.push(host);
    }
    const newEvent = new eventModel({name: eventData.name,
                                      description: eventData.description,
                                      greenspace: eventData.greenspace,
                                      starttime: eventData.starttime,
                                      endttime: eventData.endtime,
                                      participants: eventData.participants,
                                      host: host});
    try {
      return await newEvent.save();
    } catch(e) {
      throw e;
    }
  }

  that.editEvent = async (eventid, eventData, userid) => {
    try {
      const editableEvent = await eventModel.findOne({_id: eventid});
      if (editableEvent === null) {throw {msg: 'Event does not exist.'}}
      if (editableEvent.host == userid) {
        return await eventModel.findOneAndUpdate({_id: eventid}, eventData);
      } else {
        throw {msg: 'User does not have permission to edit this event.'};
      }
    } catch(e) {
      throw e;
    }
  }

  that.joinEvent = async (eventid, userid) => {
    try {
      const edditedEvent = await eventModel.findOneAndUpdate({_id: eventid}, {$push: {participants: userid}});
      if (edditedEvent === null) {throw {msg: 'Event does not exist.'}}
      return edditedEvent;
    } catch(e) {
      throw e;
    }
  }

  that.leaveEvent = async (eventid, userid, targetid) => {
    try {
      const eventData = await eventModel.findOne({_id: eventid});
      if (eventData === null) {throw {msg: 'Event does not exist.'}}
      if (userid == targetid || userid == eventData.host) {
        return await eventModel.findOneAndUpdate({_id: eventid}, {$pull: {participants: targetid}});
      } else {
        throw {msg: 'User does not have permission to remove specified user from event.'};
      }
    } catch(e) {
      throw e;
    }
  }

  that.deleteEvent = async (eventid, userid) => {
    try {
      const eventData = await eventModel.findOne({_id: eventid});
      if (eventData === null) {throw {msg: 'Event does not exist.'}}
      if (eventData.host != userid) {
        throw {msg: 'User does not have permission to delete event.'};
      }
      await eventModel.findOneAndRemove({_id: eventid});
      return;
    } catch(e) {
      throw e;
    }
  }

  Object.freeze(that);
  return that;

})(eventModel);

module.exports = event;