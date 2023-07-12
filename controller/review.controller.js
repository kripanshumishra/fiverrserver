/*
-> fetch  all the review on the bases of gig id 
-> Only buyer can post the review only once per gig 
-> buyer should be able to delete the review 
*/

const createError = require("../utils/createError");
const Review = require("../models/review.model");
const Gig = require("../models/gig.model");

const createReview = async (req, res, next) => {
  if (req.isSeller)
    return next(createError(403, " only buyers can create review"));
  if (!req.body.desc || !req.body.star )
    return next(createError(401, "stars and review both must be filled"));

  try {
    const review = await Review.find({
      gigId: req.body.gigId,
      buyer: req.userId,
    });
    // if review exists then throw error
    if (review.length)
      return next(createError(403, "You have already created a review"));
    const newReview = new Review({
      gigId: req.body.gigId,
      buyer: req.userId,
      desc: req.body.desc,
      star: req.body.star,
    });
    const savedReview = await newReview.save();
    // updating the star count on gig
    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starFrequency: 1 },
    });
    await savedReview.populate("buyer" ,  );
    res.status(201).send(savedReview);
  } catch (error) {
    console.log("createReview()", error);
    next(error);
  }
};

const getReview = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId }).populate(
      "buyer",
      { _id: 0, password: 0 }
    );
    res.status(200).send(reviews);
  } catch (error) {
    console.log("getReview()", error);
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(createError(404, "review not found"));
    if (review.buyer.toString() !== req.userId)
      return next(
        createError(403, "You are only allowed to delete your review")
      );
    await Review.findOneAndDelete(req.params.id);
    res.status(201, "review deleted successfully");
  } catch (error) {
    console.log("deleteReview()", error);
    next(error);
  }
};

module.exports = { createReview, getReview, deleteReview };
