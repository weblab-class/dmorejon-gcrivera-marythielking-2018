let BASE_URL;
if (process.env.BASE_URL) {BASE_URL = process.env.BASE_URL + 'user'}
else {BASE_URL = 'http://localhost:3000/user'}

var request = require('request-promise-native');

export default {
  info : () => {
    return request({
      uri : BASE_URL,
      method: 'GET',
      json : true
    });
  },
}
