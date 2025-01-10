const express = require("express");
const banner = require("../controllers/banner.controller");
const router = new express.Router();
const { upload } = require("../middleware/upload.middleware");

router.post("/banner", upload.single("image"), banner.addBanner);
router.get("/banner", banner.getBanner);
router.put("/banner/:id", upload.single("image"), banner.updateBanner);
router.delete("/banner/:id", banner.deleteBanner);

module.exports = router;
