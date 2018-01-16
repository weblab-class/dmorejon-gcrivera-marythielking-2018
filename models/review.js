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
      const query = await reviewModel.findOne({user: user, greenspace: greenspace});
      if (query === null) {
        return await newReview.save();
      } else {
        throw {_message: 'User has already written review.', code: 400};
      }
    } catch(e) {
      throw e;
    }
  }

  that.deleteReview = async (greenspace, user) => {
    try {
      const oldReview = await reviewModel.findOneAndRemove({user: user, greenspace: greenspace});
      if (oldReview === null) {
        throw {_message: 'Review does not exist for this user', code: 404};
      }
    } catch(e) {
      throw e;
    }
  }

  that.getReviewByGreenspace = async (greenspace) => {
    try {
      const reviews = await reviewModel.find({greenspace: greenspace});
      if (reviews.length == 0) {
        throw {_message: 'There are no reviews for this green space.', code: 404};
      }
      return reviews;
    } catch(e) {
      throw e;
    }
  }

  that.getReviewByUser = async (user) => {
    try {
      const reviews = await reviewModel.find({user: user});
      if (reviews.length == 0) {
        throw {_message: 'There are no reviews for this user.', code: 404};
      }
      return reviews;
    } catch(e) {
      throw e;
    }
  }


  Object.freeze(that);
  return that;
})(reviewModel);

module.exports = review;
