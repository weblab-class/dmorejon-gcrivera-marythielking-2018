const mongoose = require('mongoose');

const greenspaceModel = mongoose.model('Greenspace', mongoose.Schema({
  location: [{type: Number, required: true, unique: true}],
  name: {type: String, required: true}
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
        const oldGreenspace = await greenspaceModel.findOneAndRemove({_id: id});
        if (oldGreenspace === null) {
          throw {msg: 'Greenspace does not exist.', code: 404}
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
        throw {msg: 'Greenspace does not exist.', code: 404}
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
        throw {msg: 'Greenspace does not exist.', code: 404}
      }
    } catch(e) {
      throw e;
    }
  }

  Object.freeze(that);
  return that;

})(greenspaceModel);

module.exports = greenspace;