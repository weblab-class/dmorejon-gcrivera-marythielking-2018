// const BASE_URL = 'http://localhost:3000/greenspace'
const BASE_URL = 'https://greenspace2018.herokuapp.com/greenspace';

var request = require('request-promise-native');

export default {
  info : (id) => {
    return request({
      uri: BASE_URL + `/${id}`,
      method: 'GET',
      json: true,
    })
  },

  getAll : (minLat, maxLat, minLng, maxLng) => {
    return request({
      uri: BASE_URL + `/${minLat}/${maxLat}/${minLng}/${maxLng}`,
      method: 'GET',
      json: true,
    })
  },

  create : (name, location) => {
    return request({
      uri: BASE_URL,
      method: 'POST',
      json: true,
      body: {
        name,
        location,
      },
    });
  },
}
