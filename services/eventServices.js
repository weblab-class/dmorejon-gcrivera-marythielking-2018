// const BASE_URL = 'http://localhost:3000/event'
const BASE_URL = 'greenspace2018.herokuapp.com/event';

var request = require('request-promise-native');

export default {

  info : (eventid) => {
    return request({
      uri : BASE_URL + `/${eventid}`,
      method: 'GET',
      json : true
    });
  },

  getAllByUser : () => {
    return request({
      uri : BASE_URL + '/user',
      method: 'GET',
      json : true
    });
  },

  getAllByGreenspace : (greenspaceid) => {
    return request({
      uri : BASE_URL + `/greenspace/${greenspaceid}`,
      method: 'GET',
      json : true
    });
  },

  create : (name, description, greenspace, starttime, endtime, participants) => {
    return request({
      uri : BASE_URL,
      method: 'POST',
      json : true,
      body : {
        name,
        description,
        greenspace,
        starttime,
        endtime,
        participants,
      }
    });
  },

  edit : (eventid, name, description, greenspace, starttime, endtime, participants) => {
    return request({
      uri : BASE_URL + `/${eventid}`,
      method: 'PUT',
      json : true,
      body : {
        name,
        description,
        greenspace,
        starttime,
        endtime,
        participants,
      }
    });
  },

  join : (eventid) => {
    return request({
      uri : BASE_URL + `/join/${eventid}`,
      method: 'PUT',
      json : true
    });
  },

  leave : (eventid, target) => {
    return request({
      uri : BASE_URL + `/leave/${eventid}`,
      method: 'PUT',
      json : true,
      body : {
        target,
      }
    });
  },

  delete : (eventid) => {
    return request({
      uri : BASE_URL + `/${eventid}`,
      method: 'DELETE',
      json : true
    });
  }
}
