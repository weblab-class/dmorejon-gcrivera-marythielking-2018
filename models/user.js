const mongoose = require('mongoose');

const userModel = mongoose.model('User', mongoose.Schema({
  fbid: {type: Number, required: true, unique: true},
  displayname: {type: String, required: true},
  photo: {type: String, required: true}
}));

const user = ((userModel) => {
    let that = {};

    that.getUser = async (user) => {
      try {
        const userData = await userModel.findOne({fbid: user})
        if (!userData) {
          throw {message: 'User not found.', errorCode: 404};
        }
        return userData;
      } catch(e) {
        throw e;
      }
    }

    that.getUsers = async (name) => {
      try {
        const potentialUsers = await userModel.find({displayname: { $regex: '.*' + name + '.*' , $options: 'i'}});
        if (!potentialUsers) {
          throw {message: 'No users found.', errorCode: 404};
        }
        potentialUsers.sort((a, b) => {
          const a_dist = _similarity(a.displayname, name);
          const b_dist = _similarity(b.displayname, name);
          if (a_dist < b_dist) {return -1}
          else {return 1}
        });
        return potentialUsers;
      } catch(e) {
        throw e;
      }
    }

    const _similarity = (s1, s2) => {
      const longer = s1;
      const shorter = s2;
      if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
      }
      const longerLength = longer.length;
      if (longerLength == 0) {
        return 1.0;
      }
      return (longerLength - _editDistance(longer, shorter)) / parseFloat(longerLength);
    }

    const _editDistance = (s1, s2) => {
      s1 = s1.toLowerCase();
      s2 = s2.toLowerCase();

      let costs = new Array();
      for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
          if (i == 0)
            costs[j] = j;
          else {
            if (j > 0) {
              let newValue = costs[j - 1];
              if (s1.charAt(i - 1) != s2.charAt(j - 1))
                newValue = Math.min(Math.min(newValue, lastValue),
                  costs[j]) + 1;
              costs[j - 1] = lastValue;
              lastValue = newValue;
            }
          }
        }
        if (i > 0)
          costs[s2.length] = lastValue;
      }
      return costs[s2.length];
    }

    Object.freeze(that);
    return that;
})(userModel);

exports.userModel = userModel;
exports.user = user;
