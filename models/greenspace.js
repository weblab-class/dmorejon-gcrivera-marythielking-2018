const mongoose = require('mongoose');

const greenspaceModel = mongoose.model('Greenspace', mongoose.Schema({
  location: {type: [{type: Number, required: true}], required: true, unique: true},
  name: {type: String, required: true}
}));

const greenspace = ((greenspaceModel) => {
  let that = {};

  // TODO: figure out how to make sure greenspaces are unique, talk to mary
  //        about location data
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
        const oldGreenspace = await greenspaceModel.findOneAndRemove({_id: id});
        if (oldGreenspace === null) {
          throw {message: 'Greenspace does not exist.', errorCode: 404}
        }
        return;
    } catch (e) {
      throw e;
    }
  }

  that.changeGreenspaceName = async (id, name) => {
    try {
      const oldGreenspace = await greenspaceModel.findOneAndUpdate({_id: id}, {name: name});
      if (oldGreenspace === null) {
        throw {message: 'Greenspace does not exist.', errorCode: 404}
      }
      return;
    } catch(e) {
      throw e;
    }
  }

  that.changeGreenspaceLocation = async (id, location) => {
    try {
      const oldGreenspace = await greenspaceModel.findOneAndUpdate({_id: id}, {location: location});
      if (oldGreenspace === null) {
        throw {message: 'Greenspace does not exist.', errorCode: 404}
      }
      return;
    } catch(e) {
      throw e;
    }
  }

  Object.freeze(that);
  return that;

})(greenspaceModel);

module.exports = greenspace;
