const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  name: {type: String, required: true}
});

const greenspaceSchema = mongoose.Schema({
  location: {type: {$geometry: { type: 'Point' }, coordinates: [Number]}},
  _arraySignature: { type: String, unique: true },
  name: {type: String, required: true},
  tags: {type: [{type: String}], default: []},
});

greenspaceSchema.index({ "location": "2dsphere" });
const greenspaceModel = mongoose.model('Greenspace', greenspaceSchema);

const greenspace = ((greenspaceModel) => {
  let that = {};

  that.getGreenspace = async (id) => {
    try {
      const greenspaceData = await greenspaceModel.findOne({_id: id});
      if (!greenspaceData) {
        throw {message: 'Greenspace does not exist.', errorCode: 404};
      }
      greenspaceData.location = [greenspaceData.location[1], greenspaceData.location[0]];
      return greenspaceData;
    } catch(e) {
      throw e;
    }
  }

  that.getGreenspaces = async (minLat, maxLat, minLong, maxLong) => {
    try {
      const greenspaces = await greenspaceModel.find({'location.0': {$gte: minLong, $lte: maxLong},
                                                      'location.1' :{$gte: minLat, $lte: maxLat}});
      return greenspaces.map((val) => {
        val.location = [val.location[1], val.location[0]];
        return val;
      });
    } catch(e) {
      throw e;
    }
  }

  that.createGreenspace = async (name, location, tags) => {
    if (!location) {
      throw {message: 'Greenspace validation failed: location: Path `location` is required.', errorCode: 400};
    }
    const _arraySignature = location.join('.');
    const newGreenspace = new greenspaceModel({location: [location[1], location[0]],
                                                name: name,
                                                _arraySignature: _arraySignature,
                                                tags: tags});
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
      const oldGreenspace = await greenspaceModel.findOneAndUpdate({_id: id}, {location: {
                                                                                  type: 'Point',
                                                                                  coordinates: location}});
      if (!oldGreenspace) {
        throw {message: 'Greenspace does not exist.', errorCode: 404}
      }
      return;
    } catch(e) {
      throw e;
    }
  }

  that.addTag = async (id, name) => {
    try {
      if(!name) {throw {message: 'Tag name is required.', errorCode: 400}}
      name = name.toLowerCase();
      const oldGreenspace = await greenspaceModel.findOneAndUpdate({_id: id},
                                                                    {$push: {tags: name}});
      if (!oldGreenspace) {
        throw {message: 'Greenspace does not exist.', errorCode: 404}
      }
      return;
    } catch(e) {
      throw e;
    }
  }

  that.deleteTag = async (id, name) => {
    try {
      if(!name) {throw {message: 'Tag name is required.', errorCode: 400}}
      name = name.toLowerCase();
      const oldGreenspace = await greenspaceModel.findOneAndUpdate({_id: id},
                                                                    {$pull: {tags: name}});
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

exports.greenspace = greenspace;
exports.greenspaceModel = greenspaceModel;
