const mongoose = require("mongoose");
var orderModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required."],
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: [true, "Address is required."],
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
      },
      attributes: [
        {
          title: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attribute",
          },
          values: [String],
        },
      ],
    },
  ],

  payment_method: {
    type: String,
    enum: ["cashondelivery", "esewa"],
    required: true,
  },
  order_number: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["Pending", "On the way", "Delivery", "Cancel"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Order", orderModel);
