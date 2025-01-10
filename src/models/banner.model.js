const mongoose = require("mongoose");
var bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  submit: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Banner", bannerSchema);
