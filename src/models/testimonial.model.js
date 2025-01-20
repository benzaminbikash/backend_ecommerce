const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [0, "The minimum value of rating is 0."],
      max: [5, "The maximum value of rating is 5."],
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const testimonialModel = mongoose.model("Testimonial", testimonialSchema);

module.exports = { testimonialModel };
