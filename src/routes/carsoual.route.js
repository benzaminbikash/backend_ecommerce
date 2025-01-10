const express = require("express");
const router = new express.Router();
const carsoual = require("../controllers/carsoual.controller");
const { upload } = require("../middleware/upload.middleware");

router.post("/carousel", upload.array("image"), carsoual.addCarsoual);
router.get("/carousel", carsoual.getCarsoual);
router.delete("/carousel/:id", carsoual.deleteCarsoual);
router.put("/carousel-image/:id", carsoual.addMoreCaursoalImage);

module.exports = router;
