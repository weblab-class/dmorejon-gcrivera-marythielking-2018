const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true}
});
const tagModel = mongoose.model('Tag', tagSchema );

const tag = ((tagModel) => {
    let that = {};

    that.getTags = async (tag) => {
      try {
        const potentialTags = await tagModel.find({name: { $regex: '.*' + tag + '.*' , $options: 'i'}});
        if (!potentialTags) {
          return potentialTags;
        }
        potentialTags.sort((a, b) => {
          const a_dist = utils.similarity(a.name, tag);
          const b_dist = utils.similarity(b.name, tag);
          if (a_dist < b_dist) {return -1}
          else {return 1}
        });
        return potentialTags;
      } catch(e) {
        throw e;
      }
    }

    that.createTag = async (name) => {
      name = name.toLowerCase();
      const duplicateTag = await tagModel.findOne({name: name});
      if (duplicateTag) {
        return duplicateTag;
      }
      const newTag = new tagModel({name: name});
      try {
        return await newTag.save();
      } catch(e) {
        throw e;
      }
    }

    that.deleteTag = async (name) => {
      try {
          const oldTag = await tagModel.findOneAndRemove({name: name});
          if (!oldTag) {
            throw {message: 'Tag does not exist.', errorCode: 404}
          }
          return;
      } catch (e) {
        throw e;
      }
    }

    Object.freeze(that);
    return that;
})(tagModel);

module.exports = tag;