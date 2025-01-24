const mongoose = require("mongoose");
const { ApiError } = require("./ApiError");

const validateMongodbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new ApiError("Reference/mongodb id is not valid.", 400);
};

module.exports = { validateMongodbId };
