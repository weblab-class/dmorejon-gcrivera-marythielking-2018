const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fbid: {type: Number, required: true},
  displayname: {type: String, required: true},
  photo: {type: String, required: true}
});

let eventModel = mongoose.model('Event', mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  starttime: {type: Date, required: true},
  endtime: {type: Date, required: true, expires: '10s'},
  greenspace: {type: String, required: true},
  host: {type: userSchema, required: true},
  participants: {type: [{type: userSchema, required: true}], required: true}
}));

const event = ((eventModel) => {
  let that = {};

  that.getEvent = async (id) => {
    try {
      const newEvent = await eventModel.findOne({_id: id});
      if (!newEvent) {
        throw {message: 'Event does not exist.', errorCode: 404};
      }
      return newEvent;
    } catch(e) {
      throw e;
    }
  }

  that.getEventsByGreenspace = async (greenspaceid) => {
    try {
      const events = await eventModel.find({greenspace: greenspaceid});
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

  that.getEventsByUser = async (user) => {
    try {
      const events = await eventModel.find({'participants.fbid': user});
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

  that.editEvent = async (eventid, eventData, user) => {
    try {
      const editableEvent = await eventModel.findOne({_id: eventid});
      if (!editableEvent) {
        throw {message: 'Event does not exist.', errorCode: 404}
      }
      if (editableEvent.host.fbid === user.fbid) {
        return await eventModel.findOneAndUpdate({_id: eventid}, eventData, {new: true});
      } else {
        throw {message: 'User does not have permission to edit this event.', errorCode: 403};
      }
    } catch(e) {
      throw e;
    }
  }

  that.joinEvent = async (eventid, user) => {
    try {
      const editedEvent = await eventModel.findOneAndUpdate({_id: eventid}, {$push: {participants: user}}, {new: true});
      if (!editedEvent) {throw {message: 'Event does not exist.', errorCode: 404}}
      return editedEvent;
    } catch(e) {
      throw e;
    }
  }

  that.leaveEvent = async (eventid, user, target) => {
    try {
      const eventData = await eventModel.findOne({_id: eventid});
      if (!eventData) {throw {message: 'Event does not exist.', errorCode: 404}}
      if (target.fbid === eventData.host.fbid) {throw {message: 'Host cannot leave event.', errorCode: 400}}
      if (user.fbid === target.fbid || user.fbid === eventData.host.fbid) {
        return await eventModel.findOneAndUpdate({_id: eventid}, {$pull: {participants: target}}, {new: true});
      } else {
        throw {message: 'User does not have permission to remove specified user from event.', errorCode: 403};
      }
    } catch(e) {
      throw e;
    }
  }

  that.deleteEvent = async (eventid, user) => {
    try {
      const eventData = await eventModel.findOne({_id: eventid, 'host.fbid': user.fbid});
      if (!eventData) {throw {message: 'Event does not exist.', errorCode: 404}}
      await eventModel.findOneAndRemove({_id: eventid, host: user});
      return;
    } catch(e) {
      throw e;
    }
  }

  Object.freeze(that);
  return that;

})(eventModel);

module.exports = event;
