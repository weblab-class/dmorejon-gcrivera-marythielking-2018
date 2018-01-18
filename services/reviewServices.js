const BASE_URL = 'http://localhost:3000/review';

var request = require('request-promise-native');

export default {

  getAllByUser : (greenspaceid) => {
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

  create : (name, location) => {
    return request({
      uri : BASE_URL,
      method: 'POST',
      json : true,
      body : {
        name,
        location,
      }
    });
  },

  delete : (greenspace) => {
    return request({
      uri : BASE_URL,
      method: 'DELETE',
      json : true,
      body : {
        greenspace,
      }
    });
  },
}
