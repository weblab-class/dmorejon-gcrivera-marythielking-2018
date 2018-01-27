const BASE_URL = 'http://localhost:3000/discover'
// const BASE_URL = 'https://greenspace2018.herokuapp.com/discover';

var request = require('request-promise-native');

export default {

  info : (userLocation) => {
    userLocation = userLocation.toString();
    return request({
      uri : BASE_URL + `/${userLocation}`,
      method: 'GET',
      json : true
    });
  },
}