const mongoose = require("mongoose");
const blogSchmea = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    image: {
      type: String,
      required: [true, "Image is required."],
    },
  },
  {
    timestamps: true,
  }
);

const blogModal = mongoose.model("Blog", blogSchmea);

module.exports = { blogModal };
