const mongoose = require('mongoose');
const utils = require('../utils');
const greenspaceModel = require('./greenspace').greenspaceModel;
const userModel = require('./user').userModel;
const eventModel = require('./event').eventModel;

const discover = (() => {
    let that = {};

    that.getDiscoveryInfo = async (userid, userLocation) => {
      try {
        const user = await _getUserData(userid);
        const greenspaces = await _getPossibleGreenspaces(userLocation);
        let greenspacesAndEvents = [];
        await Promise.all(greenspaces.map(async (greenspace) => {
          const events = await _getEvents(greenspace);
          greenspacesAndEvents.push({greenspace: greenspace, events: events});
          return;
        }));
        greenspacesAndEvents = greenspacesAndEvents.sort((a, b) => {
          const a_dtfe = _DTFE(a.greenspace, user, userLocation, a.events);
          const b_dtfe = _DTFE(b.greenspace, user, userLocation, b.events);
          if (a_dtfe >= b_dtfe) {return -1;}
          else {return 1;}
        });
        // console.log(greenspacesAndEvents);
        return greenspacesAndEvents;
      } catch(e) {
        console.log(e)
        throw e;
      }
    }

    const _getUserData = async (userid) => {
      try {
        const userData = await userModel.findOne({fbid: userid});
        if (!userData) {
          throw {message: 'User not found.', errorCode: 404};
        }
        return userData;
      } catch(e) {
        throw e;
      }
    }

    const _getEvents = async (greenspace) => {
      try {
        return await eventModel.find({'greenspace._id': greenspace._id})
                                          .sort({starttime: 1})
                                          .limit(5);
      } catch(e) {
        throw e;
      }
    }

    const _getPossibleGreenspaces = async (userLocation) => {
      try {
        const greenspaces = await greenspaceModel.find({location: {
                                                          $nearSphere: {
                                                            $geometry: {
                                                              type: 'Point',
                                                              coordinates: userLocation
                                                            },
                                                            $minDistance: 0,
                                                            $maxDistance: 40233.6 // 25 miles
                                                          }}});
      return greenspaces;
      } catch(e) {
        throw e;
      }
    }

    const _DTFE = (greenspace, user, userLocation, events) => {
      const D = _getDistance(greenspace, userLocation);
      const T = _getTag(greenspace, user, events);
      const F = _getFavorite(greenspace, user);
      const E = _getAttatched(user.fbid, events);

      return (T * F * E) / D;
    }

    const _getDistance = (greenspace, userLocation) => {
      const R = 3959; // radius of earth in miles

      let lat1 = greenspace.location.coordinates[0];
      const lon1 = greenspace.location.coordinates[1];

      let lat2 = userLocation[0];
      const lon2 = userLocation[1];

      const dLat = _toRadian(lat2-lat1);
      const dLon = _toRadian(lon2-lon1);
      lat1 = _toRadian(lat1);
      lat2 = _toRadian(lat2);

      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const d = R * c;
      return d / 25.0;
    }

    const _toRadian = (val) => {
      return val * Math.PI / 180;
    }

    const _getTag = (greenspace, user, events) => {
      const numUserTags = user.tags.length;
      const commonTags = user.tags.filter((tag) => {
        if (greenspace.tags.includes(tag)) {return true;}
        const commonEventTags = events.filter((event) => {
          return event.tags.includes(tag);
        });
        if (commonEventTags.length > 0) {return true;}
        return false;
      });

      return commonTags.length / numUserTags;
    }

    const _getFavorite = (greenspace, user) => {
      const favoriteCheck = user.favorites.some((favorite) => {
        return favorite._id == greenspace._id;
      });
      if (favoriteCheck) {return 0.25;}
      return 0.75;
    }

    const _getAttatched = (userid, events) => {
      const attatched = events.some((event) => {
        const participating = event.participants.some((participant) => {
          return participant.fbid == userid;
        });
        if (participating) {return true;}
        return false;
      });

      if (attatched) {return 0.25;}
      return 0.75;
    }

    Object.freeze(that);
    return that;
})();

module.exports = discover;
