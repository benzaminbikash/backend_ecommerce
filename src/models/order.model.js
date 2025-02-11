const mongoose = require("mongoose");
var orderModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CART",
  },
  payment_method: {
    type: String,
    enum: ["cashondelivery", "online"],
    required: true,
  },
});

module.exports = mongoose.model("User", orderModel);
