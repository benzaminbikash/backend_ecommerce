const express = require("express");
const router = new express.Router();
const coupon = require("../controllers/coupon.controller");

router.get("/coupon", coupon.getCoupon);
router.post("/coupon", coupon.addCoupon);
router.put("/coupon/:id", coupon.updateCoupon);
router.delete("/coupon/:id", coupon.deleteCoupon);

module.exports = router;
