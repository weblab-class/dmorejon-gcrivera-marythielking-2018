const mongoose = require('mongoose');
const utils = require('../utils');

const userSchema = mongoose.Schema({
  fbid: {type: Number, required: true, unique: true},
  displayname: {type: String, required: true},
  photo: {type: String, required: true},
  tags: {type: [{type: String}], default: []},
});
const userModel = mongoose.model('User', userSchema );

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
          const a_dist = utils.similarity(a.displayname, name);
          const b_dist = utils.similarity(b.displayname, name);
          if (a_dist < b_dist) {return -1}
          else {return 1}
        });
        return potentialUsers;
      } catch(e) {
        throw e;
      }
    }

    Object.freeze(that);
    return that;
})(userModel);

exports.userModel = userModel;
exports.user = user;
exports.userSchema = userSchema;
