const mongoose = require('mongoose');
const schedule = require('node-schedule');
const userModel = require('./user').userModel;

const userSchema = mongoose.Schema({
  fbid: {type: Number, required: true},
  displayname: {type: String, required: true},
  photo: {type: String, required: true}
});

const greenspaceSchema = mongoose.Schema({
  location: {type: [{type: Number, required: true}], required: true},
  _arraySignature: { type: String},
  name: {type: String, required: true}
});

let eventModel = mongoose.model('Event', mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  starttime: {type: Date, required: true},
  endtime: {type: Date, required: true, expires: '10s'},
  greenspace: {type: greenspaceSchema, required: true},
  host: {type: userSchema, required: true},
  participants: {type: [{type: userSchema, required: true, unique: true}], required: true},
  pending: {type: [{type: userSchema, unique: true}], default: []},
  tags: {type: [{type: String}], default: []},
}));

schedule.scheduleJob('0 0 * * *', async () => { // minute (0), hour (0), runs every night @ midnight
  try {
    const allEvents = await eventModel.find();
    if (allEvents.length == 0) {
      console.log("No events to update...");
      return;
    }
    await Promise.all(allEvents.map(async (val) => {
      // update host profile pic
      let updatedHost;
      const host = await userModel.findOne({fbid: val.host.fbid});
      if (host.photo !== val.host.photo) {updatedHost = host}
      else {updatedHost = val.host}
      // update pending users
      const updatedPending = await Promise.all(val.pending.map(async (user) => {
        const updatedUser = await userModel.findOne({fbid: user.fbid});
        if (user.photo !== updatedUser.photo) {return updatedUser}
        return user;
      }));
      // update participants
      const updatedParticipants = await Promise.all(val.participants.map(async (user) => {
        const updatedUser = await userModel.findOne({fbid: user.fbid});
        if (user.photo !== updatedUser.photo) {return updatedUser}
        return user;
      }));
      // update event
      await eventModel.findOneAndUpdate({_id: val._id}, {host: updatedHost,
                                                          pending: updatedPending,
                                                          participants: updatedParticipants});
      return;
    }));
  } catch (e) {
    console.log(e);
  }
});

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
      const events = await eventModel.find({'greenspace._id' : greenspaceid});
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

  that.getPendingEventsByUser = async (user) => {
    try {
      const events = await eventModel.find({'pending.fbid': user});
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
    const newEvent = new eventModel({name: eventData.name,
                                      description: eventData.description,
                                      greenspace: eventData.greenspace,
                                      starttime: eventData.starttime,
                                      endtime: eventData.endtime,
                                      participants: [host],
                                      pending: eventData.pending,
                                      tags: eventData.tags,
                                      host: host
                                      });
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
      const inPending = eventModel.findOne({'pending': user});
      if (inPending) {
        await eventModel.findOneAndUpdate({_id: eventid}, {$pull: {pending: user}});
      }
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

  that.acceptEvent = async (eventid, user) => {
    try {
      await eventModel.findOneAndUpdate({_id: eventid}, {$pull: {pending: user}});
      const editedEvent = await eventModel.findOneAndUpdate({_id: eventid}, {$push: {participants: user}}, {new: true});
      if (!editedEvent) {throw {message: 'Event or user not found.', errorCode: 404}}
      return editedEvent;
    } catch(e) {
      throw e;
    }
  }

  that.declineEvent = async (eventid, user) => {
    try {
      const editedEvent = await eventModel.findOneAndUpdate({_id: eventid}, {$pull: {pending: user}}, {new: true});
      if (!editedEvent) {throw {message: 'Event or user not found.', errorCode: 404}}
      return editedEvent;
    } catch(e) {
      throw e;
    }
  }

  that.inviteUser = async (eventid, target, user) => {
    try {
      const eventData = await eventModel.findOne({_id: eventid,
                                                  'participants.fbid': {$ne: target.fbid},
                                                  'pending.fbid': {$ne: target.fbid}});
      if (!eventData) {throw {message: 'Event does not exist or user is already a part of event.', errorCode: 404}}
      const eventMember = eventData.participants.some((participant) => {
        return participant.fbid == user.fbid;
      });
      if (!eventMember) {throw {message: 'User does not have permission to invite someone to this event.', errorCode: 403}}
      return await eventModel.findOneAndUpdate({_id: eventid}, {$push: {pending: target}}, {new: true});
    } catch(e) {
      throw e;
    }
  }

  that.addTag = async (id, name, user) => {
    try {
      if(!name) {throw {message: 'Tag name is required.', errorCode: 400}}
      name = name.toLowerCase();
      const oldEvent = await eventModel.findOneAndUpdate({_id: id, 'host.fbid': user.fbid},
                                                                    {$push: {tags: name}});
      if (!oldEvent) {
        throw {message: 'Event does not exist.', errorCode: 404}
      }
      return;
    } catch(e) {
      throw e;
    }
  }

  that.deleteTag = async (id, name, user) => {
    try {
      if(!name) {throw {message: 'Tag name is required.', errorCode: 400}}
      name = name.toLowerCase();
      const oldEvent = await eventModel.findOneAndUpdate({_id: id, 'host.fbid': user.fbid},
                                                                    {$pull: {tags: name}});
      if (!oldEvent) {
        throw {message: 'Event does not exist.', errorCode: 404}
      }
      return;
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

exports.event = event;
exports.eventModel = eventModel;
