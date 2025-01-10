const mongoose = require("mongoose");
var subAttribute = new mongoose.Schema({
  attribute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attribute",
    unique: [true, "You cannot add same attribute"],
    index: 1,
  },
  title: [String],
});
module.exports = mongoose.model("SubAttribute", subAttribute);
