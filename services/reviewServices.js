const BASE_URL = 'http://localhost:3000/review';

var request = require('request-promise-native');

export default {
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
}
