const express = require("express");
const statistic = require("../controllers/statistic.controller");
const router = new express.Router();

router.post("/statistic", upload.single("image"), statistic.addStatistic);
router.get("/statistic", statistic.getStatistic);
router.delete("/statistic/:id", statistic.deleteStatistic);
router.put("/statistic/:id", statistic.updateStatistic);

module.exports = router;
