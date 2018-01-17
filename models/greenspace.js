const mongoose = require('mongoose');

const greenspaceModel = mongoose.model('Greenspace', mongoose.Schema({
  location: {type: [{type: Number, required: true}], required: true, unique: true},
  name: {type: String, required: true}
}));

const greenspace = ((greenspaceModel) => {
  let that = {};

  that.getGreenspace = async (id) => {
    try {
      const greenspaceData = await greenspaceModel.findOne({_id: id});
      if (!oldGreenspace) {
        throw {message: 'Greenspace does not exist.', errorCode: 404};
      }
      return greenspaceData;
    } catch(e) {
      throw e;
    }
  }

  that.getGreenspaces = async (minLong, maxLong, minLat, maxLat) => {
    try {
      const greenspaces = await greenspace.find({location:
          [{$lte: minLong, $gte: maxLong}, {$lte: minLat, $gte: maxLat}]});
      if (greenspaces.length == 0) {
        throw {message: 'No Greenspaces found.', errorCode: 404};
      }
      return greenspaces;
    } catch(e) {
      throw e;
    }
  }

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
        if (!oldGreenspace) {
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
      if (!oldGreenspace) {
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
      if (!oldGreenspace) {
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