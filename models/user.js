var mongoose = require('mongoose');

var userModel = mongoose.model('User', mongoose.Schema({
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

    Object.freeze(that);
    return that;
})(userModel);

exports.userModel = userModel;
exports.user = user;
