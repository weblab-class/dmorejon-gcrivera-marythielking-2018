const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fbid: {type: Number, required: true},
  displayname: {type: String, required: true},
  photo: {type: String, required: true}
});

const reviewModel = mongoose.model('Review', mongoose.Schema({
  greenspace: {type: String, required: true},
  user: {type: userSchema, required: true},
  body: {type: String, required: true},
  rating: {type: Number, required: true},
  time: {type: Date, required: true}
}));

const review = ((reviewModel) => {
  let that = {};

  that.createReview = async (greenspace, rating, body, time, user) => {
    const newReview = new reviewModel({greenspace: greenspace, rating: rating,
                                        body: body, time: time, user: user});
    try {
      const query = await reviewModel.findOne({'user.fbid': user.fbid, greenspace: greenspace});
      if (!query) {
        return await newReview.save();
      } else {
        throw {message: 'User has already written review.', errorCode: 400};
      }
    } catch(e) {
      throw e;
    }
  }

  that.deleteReview = async (greenspace, user) => {
    try {
      const oldReview = await reviewModel.findOneAndRemove({'user.fbid': user.fbid, greenspace: greenspace});
      if (!oldReview) {
        throw {message: 'Review does not exist for this user', errorCode: 404};
      }
    } catch(e) {
      throw e;
    }
  }

  that.getReviewByGreenspace = async (greenspace) => {
    try {
      let reviews = await reviewModel.find({greenspace: greenspace});
      if (reviews.length == 0) {return {reviews: reviews, rating: 0.0};}
      reviews = reviews.sort((a, b) => {
        if (a.time.getTime() > b.time.getTime()) {
          return -1;
        } else {
          return 1;
        }
      });
      const ratingSum = reviews.reduce((sum, currReview) => {
        return sum + currReview.rating;
      });
      return {reviews: reviews, rating: ratingSum/reviews.length};
    } catch(e) {
      throw e;
    }
  }

  that.getReviewByUser = async (user) => {
    try {
      const reviews = await reviewModel.find({'user.fbid': user.fbid});
      return reviews.sort((a, b) => {
        if (a.time.getTime() > b.time.getTime()) {
          return -1;
        } else {
          return 1;
        }
      });
    } catch(e) {
      throw e;
    }
  }


  Object.freeze(that);
  return that;
})(reviewModel);

module.exports = review;
