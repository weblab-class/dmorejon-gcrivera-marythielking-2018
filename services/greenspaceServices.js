const BASE_URL = 'http://localhost:3000/greenspace';

var request = require('request-promise-native');

export default {
  info : (id) => {
    return request({
      uri: BASE_URL + `/${id}`,
      method: 'GET',
      json: true,
    })
  },

  getAll : (topLeft, bottomRight) => {
    return request({
      uri: BASE_URL + `/${topLeft.lng}/${bottomRight.lng}/${bottomRight.lat}/${topLeft.lat}`,
      method: 'GET',
      json: true,
    })
  }

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
