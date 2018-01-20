// const BASE_URL = 'http://localhost:3000/user'
const BASE_URL = 'http://greenspace2018.herokuapp.com/user';

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
