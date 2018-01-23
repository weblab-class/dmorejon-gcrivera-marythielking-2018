// const BASE_URL = 'http://localhost:3000/event'
const BASE_URL = 'https://greenspace2018.herokuapp.com/event';

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

  getAllPendingByUser : () => {
    return request({
      uri : BASE_URL + '/user/pending',
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

  create : (name, description, greenspace, starttime, endtime, pending, tags) => {
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
        pending,
        tags,
      }
    });
  },

  edit : (eventid, name, description, greenspace, starttime, endtime, pending, participants) => {
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
        pending,
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

  accept : (eventid) => {
    return request({
      uri : BASE_URL + `/accept/${eventid}`,
      method: 'PUT',
      json : true
    });
  },

  decline : (eventid) => {
    return request({
      uri : BASE_URL + `/decline/${eventid}`,
      method: 'PUT',
      json : true
    });
  },

  addTag : (eventid, name) => {
    return request({
      uri : BASE_URL + `/add/tag`,
      method: 'PUT',
      json : true,
      body : {
        eventid,
        name,
      }
    });
  },

  deleteTag : (eventid, name) => {
    return request({
      uri : BASE_URL + `/delete/tag`,
      method: 'PUT',
      json : true,
      body : {
        eventid,
        name,
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
