const express = require("express");
const router = new express.Router();
const category = require("../controllers/category.controller");
const { upload } = require("../middleware/upload.middleware");

router
  .route("/category")
  .get(category.getCategories)
  .post(upload.single("image"), category.addCategory);

router
  .route("/category/:id")
  .get(category.getCategory)
  .put(upload.single("image"), category.updateCategory)
  .delete(category.deleteCategory);

module.exports = router;
