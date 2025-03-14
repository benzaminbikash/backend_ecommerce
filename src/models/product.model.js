const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    priceafterdiscount: {
      type: Number,
      required: true,
    },
    mainimage: {
      type: String,
      required: true,
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },

    stock: {
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
    orderIndex: {
      type: Number,
    },
    video: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "The minimum rating is 1."],
      max: [5, "The maxium rating is 5."],
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Product", productSchema);

module.exports = { productModel };
