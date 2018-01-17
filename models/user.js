var mongoose = require('mongoose');

var userModel = mongoose.model('User', mongoose.Schema({
  fbid: {type: Number, required: true, unique: true},
  displayname: {type: String, required: true},
  username: {type: String, required: true, unique: true}, // TODO: possibly remove required
  email: {type: String, required: true, unique: true} // TODO: possibly remove required
}));

const user = ((userModel) => {
    let that = {};

    that.updateUser = async (user, username, email) => {
      try {
        const oldUser =  await userModel.findOneAndUpdate({user: user}, {username: username, email: email},
                                              {new: false});
        if (!oldUser) {
          throw {message: 'User not found, cannot update', errorCode: 404};
        }
      } catch(e) {
        throw e;
      }
    }

    that.getUser = async (user) => {
      try {
        const userData = await userModel.findOne({user: user})
        if (!userData) {
          throw {message: 'User not found.', errorCode: 404};
        }
      } catch(e) {
        throw e;
      }
    }

    Object.freeze(that);
    return that;
})(userModel);

exports.userModel = userModel;
exports.user = user;
