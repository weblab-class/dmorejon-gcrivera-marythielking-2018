const BASE_URL = 'http://localhost:3000/tag'
// const BASE_URL = 'https://greenspace2018.herokuapp.com/tag';

var request = require('request-promise-native');

export default {

  search : (name) => {
    return request({
      uri : BASE_URL + `/${name}`,
      method : 'GET',
      json : true
    });
  },

  create : (name) => {
    return request({
      uri : BASE_URL,
      method : 'POST',
      json : true,
      body : {
        name,
      }
    });
  },

  delete : (name) => {
    return request({
      uri : BASE_URL + `/${name}`,
      method : 'DELETE',
      json : true,
    });
  },
}
