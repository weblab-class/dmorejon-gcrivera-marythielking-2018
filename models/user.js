var mongoose = require('mongoose');

var userModel = mongoose.model('User', mongoose.Schema({
  fbid: {type: Number, required: true, unique: true},
  displayname: {type: String, required: true},
  username: {type: String, unique: true},
  email: {type: String, unique: true}
}));

const user = ((userModel) => {
    let that = {};

    that.updateUser = async (user, username, email) => {
      try {
        const editableUser = await eventModel.findOne({fbid: user});
        if (!editableUser) {
          throw {message: 'User does not exist.', errorCode: 404}
        }
        return await userModel.update({fbid: user},
                                {username: username, email: email},
                                {new: true});
      } catch(e) {
        throw e;
      }
    }

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

    Object.freeze(that);
    return that;
})(userModel);

exports.userModel = userModel;
exports.user = user;
