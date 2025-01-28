const express = require("express");
const router = new express.Router();
const carsoual = require("../controllers/carsoual.controller");
const { upload } = require("../middleware/upload.middleware");

router.post("/carousel", upload.array("image", 5), carsoual.addCarsoual);
router.get("/carousel", carsoual.getCarsoual);
router.delete("/carousel/:id", carsoual.deleteCarsoual);
router.put("/carousel/:id", upload.array("image", 5), carsoual.updateCarsoual);

module.exports = router;
