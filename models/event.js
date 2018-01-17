var mongoose = require('mongoose');

var eventModel = mongoose.model('Event', mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  starttime: {type: Date, required: true},
  endtime: {type: Date, required: true, expires: '10s'},
  greenspace: {type: String, required: true},
  host: {type: String, required: true},
  participants: {type: [{type: String, required: true}], required: true}
}));

const event = ((eventModel) => {
  let that = {};

  that.getEvent = async (id) => {
    try {
      const newEvent = await eventModel.findOne({_id: id});
      if (!newEvent) {
        throw {message: 'Event does not exist.', errorCode: 404}
      }
      return newEvent;
    } catch(e) {
      throw e;
    }
  }

  that.getEventsByGreenspace = async (greenspaceid) => {
    try {
      const events = await eventModel.find({greenspace: greenspaceid});
      if (events.length == 0) {
        throw {message: 'There are no events for this greenspace.', errorCode: 404}
      }
      return events.sort((a, b) => {
        if (a.starttime.getTime() > b.starttime.getTime()) {
          return 1;
        } else {
          return -1;
        }
      });
    } catch(e) {
      throw e;
    }
  }

  that.getEventsByUser = async (userid) => {
    try {
      const events = await eventModel.find({participants: userid});
      if (events.length == 0) {
        throw {message: 'There are no events for this user.', errorCode: 404}
      }
      return events.sort((a, b) => {
        if (a.starttime.getTime() > b.starttime.getTime()) {
          return 1;
        } else {
          return -1;
        }
      });
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
                                      endtime: eventData.endtime,
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
      if (!editableEvent) {
        throw {message: 'Event does not exist.', errorCode: 404}
      }
      if (editableEvent.host == userid) {
        return await eventModel.findOneAndUpdate({_id: eventid}, eventData, {new: true});
      } else {
        throw {message: 'User does not have permission to edit this event.', errorCode: 403};
      }
    } catch(e) {
      throw e;
    }
  }

  that.joinEvent = async (eventid, userid) => {
    try {
      const edditedEvent = await eventModel.findOneAndUpdate({_id: eventid}, {$push: {participants: userid}}, {new: true});
      if (!edditedEvent) {throw {message: 'Event does not exist.', errorCode: 404}}
      return edditedEvent;
    } catch(e) {
      throw e;
    }
  }

  that.leaveEvent = async (eventid, userid, targetid) => {
    try {
      const eventData = await eventModel.findOne({_id: eventid});
      if (!eventData) {throw {message: 'Event does not exist.', errorCode: 404}}
      if (userid == targetid || userid == eventData.host) {
        return await eventModel.findOneAndUpdate({_id: eventid}, {$pull: {participants: targetid}}, {new: true});
      } else {
        throw {message: 'User does not have permission to remove specified user from event.', errorCode: 403};
      }
    } catch(e) {
      throw e;
    }
  }

  that.deleteEvent = async (eventid, userid) => {
    try {
      const eventData = await eventModel.findOne({_id: eventid});
      if (!eventData) {throw {message: 'Event does not exist.', errorCode: 404}}
      if (eventData.host != userid) {
        throw {message: 'User does not have permission to delete event.', errorCode: 403};
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