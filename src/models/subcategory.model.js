const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required."],
  },
  title: {
    type: String,
    required: [true, "Sub category title is required."],
    unique: [true, "Sub category tile must be unique."],
  },
});

const subCategoryModel = mongoose.model("SubCategory", subCategorySchema);
subCategoryModel.createIndexes();

module.exports = { subCategoryModel };
