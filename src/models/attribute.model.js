const mongoose = require("mongoose");
var attributeSchema = new mongoose.Schema({
  title: {
    type: String,
  },
});

module.exports = mongoose.model("Attribute", attributeSchema);
