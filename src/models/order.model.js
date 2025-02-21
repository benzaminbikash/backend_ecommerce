const mongoose = require("mongoose");
var orderModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Shipping Address is required."],
    },
    billingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Billing Address is required"],
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
    onlinepayimage: {
      type: String,
    },
    payment_method: {
      type: String,
      enum: ["cashondelivery", "esewa", "khalti", "ime-pay"],
      required: true,
    },
    deliveryid: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Pending", "On the way", "Delivery", "Cancel"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderModel);
