const mongoose = require('mongoose');

const greenspaceModel = mongoose.model('Greenspace', mongoose.Schema({
  location: [{type: Number, required: true, unique: true}],
  name: {type: String, required: true},
  events: [{type: String}],
  reviews: [{type: String}]
}));

const greenspace = ((greenspaceModel) => {
  let that = {};

  that.createGreenspace = async (name, location) => {
    const newGreenspace = new greenspaceModel({location: location, name: name});
    try {
      return await greenspaceModel.save(newGreenspace);
    } catch(e) {
      return e;
    }
  }

  Object.freeze(that);
  return that;

})(greenspaceModel);

exports.greenspaceModel = greenspaceModel;
exports.greenspace = greenspace;