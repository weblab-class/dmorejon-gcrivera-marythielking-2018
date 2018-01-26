const BASE_URL = 'http://localhost:3000/user'
// const BASE_URL = 'https://greenspace2018.herokuapp.com/user';

var request = require('request-promise-native');

export default {
  info : () => {
    return request({
      uri : BASE_URL,
      method: 'GET',
      json : true
    });
  },

  search : (name) => {
    return request({
      uri : BASE_URL + `/${name}`,
      method: 'GET',
      json : true
    });
  },

  addTag : (name) => {
    return request({
      uri : BASE_URL + '/tag/create',
      method: 'PUT',
      json : true,
      body : {
        name,
      }
    });
  },

  deleteTag : (name) => {
    return request({
      uri : BASE_URL + '/tag/delete',
      method: 'PUT',
      json : true,
      body : {
        name,
      }
    });
  },
}
