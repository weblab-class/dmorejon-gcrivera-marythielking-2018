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
      return await newGreenspace.save();
    } catch(e) {
      throw e;
    }
  }

  that.deleteGreenspace = async (id) => {
    try {
        await greenspaceModel.findOne({_id: id});
        await greenspaceModel.remove({_id: id});
        return;
    } catch (e) {
      throw e;
    }
  }

  that.changeGreenspaceName = async (id, name) => {
    try {
      await greenspaceModel.findOneAndUpdate({_id: id}, {name: name});
    } catch(e) {
      throw e;
    }
  }

  that.changeGreenspaceLocation = async (id, location) => {
    try {
      await greenspaceModel.findOneAndUpdate({_id: id}, {location: location});
    } catch(e) {
      throw e;
    }
  }

  Object.freeze(that);
  return that;

})(greenspaceModel);

exports.greenspace = greenspace;