const mongoose = require("mongoose");
var couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    minimum_spend: {
      type: Number,
      required: true,
    },
    valid_from: {
      type: Date,
      required: true,
    },
    valid_to: {
      type: Date,
      required: true,
    },
    status: {
      type: "string",
      enum: ["active", "inactive", "cancelled"],
      default: "active",
    },
    used_count: {
      type: Number,
    },
    used_limit: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Coupon", couponSchema);
