const BASE_URL = 'http://localhost:3000/event';

var request = require('request-promise-native');

export default {
  create : (name, description, greenspace, starttime, endtime, participants) => {
    return request({
      uri : BASE_URL,
      method: 'POST',
      json : true,
      body : {
        name,
        description,
        greenspace,
        starttime,
        endtime,
        participants,
      }
    });
  },
}
