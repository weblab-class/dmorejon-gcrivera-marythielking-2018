const mongoose = require('mongoose');

const reviewModel = mongoose.model('Review', mongoose.Schema({
  greenspace: {type: String, required: true},
  user: {type: String, required: true},
  body: {type: String, required: true},
  rating: {type: Number, required: true},
  time: {type: String, required: true}
}));

const review = ((reviewModel) => {
  let that = {};

  that.createReview = async (greenspace, rating, body, time, user) => {

    const newReview = new reviewModel({greenspace: greenspace, rating: rating,
                                        body: body, time: time, user: user});
    try {

      const query = await reviewModel.findOne({user:user, greenspace:greenspace});
      if (query === null) {
        return await newReview.save();
      } else {
        throw {msg: 'User has already written review.'};
      }

    } catch(e) {
      throw e;
    }
  }

  that.deleteReview = async (greenspace, user) => {
    try{

      const oldReview = await reviewModel.findOneAndRemove({user:user, greenspace:greenspace});
      if (oldReview === null) {
        throw {msg: 'Review does not exist for this user'};
      }

    } catch(e) {
      throw e;
    }
  }

  that.getReviewByGreenspace = async (greenspace) => {
    try {
      return await reviewModel.find({greenspace:greenspace});
    } catch(e) {
      throw e;
    }
  }

  that.getReviewByUser = async (user) => {
    try {
      return await reviewModel.find({user:user});
    } catch(e) {
      throw e;
    }
  }


  Object.freeze(that);
  return that;
})(reviewModel);

exports.reviewModel = reviewModel;
exports.review = review;
