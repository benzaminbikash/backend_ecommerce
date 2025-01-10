const mongoose = require("mongoose");
var carsoualSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  carsoual: {
    type: [],
    required: true,
  },
});

const carsoualModel = mongoose.model("Carsoual", carsoualSchema);
module.exports = carsoualModel;
