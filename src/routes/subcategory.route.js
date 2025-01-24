const express = require("express");
const subcategory = require("../controllers/subcategory.controller");
const router = new express.Router();

router.post("/subcategory", subcategory.addSubCategory);
router.get("/subcategory", subcategory.getSubCategory);
router.delete("/subcategory/:id", subcategory.deleteSubCategory);
router.put("/subcategory/:id", subcategory.updateSubCategory);

module.exports = router;
