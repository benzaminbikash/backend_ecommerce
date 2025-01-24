const mongoose = require("mongoose");
var subAttribute = new mongoose.Schema({
  attribute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attribute",
    unique: [true, "You cannot add same attribute."],
  },
  title: {
    type: [String],
    required: [true, "Title must be required."],
  },
});
module.exports = mongoose.model("SubAttribute", subAttribute);
