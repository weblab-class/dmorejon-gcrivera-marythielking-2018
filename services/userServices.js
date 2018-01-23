// const BASE_URL = 'http://localhost:3000/user'
const BASE_URL = 'https://greenspace2018.herokuapp.com/user';

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

  isFavorite : (gid) => {
    return request({
      uri : BASE_URL + `/favorites/check/${gid}`,
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

  addFavorite : (greenspaceObj) => {
    return request({
      uri : BASE_URL + '/favorites/add',
      method: 'PUT',
      json : true,
      body : { greenspace: {
        name: greenspaceObj.name,
        location: greenspaceObj.location,
        _arraysignature: greenspaceObj._arraysignature,
        tags: greenspaceObj.tags,
        _id : greenspaceObj._id,
        }
      }
    });
  },

  removeFavorite : (greenspaceObj) => {
    return request({
      uri : BASE_URL + '/favorites/remove',
      method: 'PUT',
      json : true,
      body : { greenspace: {
        name: greenspaceObj.name,
        location: greenspaceObj.location,
        _arraysignature: greenspaceObj._arraysignature,
        tags: greenspaceObj.tags,
        _id : greenspaceObj._id,
        }
      },
    });
  },
}
