const mongoose = require('mongoose');

const greenspaceModel = mongoose.model('Greenspace', mongoose.Schema({
  location: {type: [{type: Number, required: true}], required: true},
  _arraySignature: { type: String, unique: true },
  name: {type: String, required: true}
}));

const greenspace = ((greenspaceModel) => {
  let that = {};

  that.getGreenspace = async (id) => {
    try {
      const greenspaceData = await greenspaceModel.findOne({_id: id});
      if (!greenspaceData) {
        throw {message: 'Greenspace does not exist.', errorCode: 404};
      }
      return greenspaceData;
    } catch(e) {
      throw e;
    }
  }

  that.getGreenspaces = async (minLat, maxLat, minLong, maxLong) => {
    try {
      return await greenspaceModel.find({'location.0': {$gte: minLat, $lte: maxLat},
                                                      'location.1' :{$gte: minLong, $lte: maxLong}});
    } catch(e) {
      throw e;
    }
  }

  that.createGreenspace = async (name, location) => {
    if (!location) {
      throw {message: 'Greenspace validation failed: location: Path `location` is required.', errorCode: 400};
    }
    const _arraySignature = location.join('.');
    const newGreenspace = new greenspaceModel({location: location,
                                                name: name,
                                                _arraySignature: _arraySignature});
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
