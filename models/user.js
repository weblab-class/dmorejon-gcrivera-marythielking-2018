var mongoose = require('mongoose');

var userModel = mongoose.model('User', mongoose.Schema({
  fbid: {type: Number, required: true, unique: true},
  displayname: {type: String, required: true},
  username: {type: String, required: true}, // TODO: possibly remove required
  email: {type: String, required: true} // TODO: possibly remove required
}));

const user = (userModel) => {
    let that = {};

    that.updateUser = async (user, username, email) => {
      try {
        oldUser =  await userModel.findOneAndUpdate({user:user}, {user:user, username:username, email:email},
                                              {new:false});
        if (oldUser == null) {
          throw {msg: 'User not found, cannot update'};
        }
      } catch(e) {
        throw e;
      }
    }

    that.getUser = async (user) => {
      try {
        return await userModel.findOne({user:user})
      } catch(e) {
        throw e;
      }
    }

    Object.freeze(that);
    return that;
})(userModel);
exports.userModel = userModel;
exports.user = user;
