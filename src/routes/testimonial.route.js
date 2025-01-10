const express = require("express");
const router = new express.Router();
const testimonial = require("../controllers/testimonial.controller");
const { upload } = require("../middleware/upload.middleware");

router.post("/testimonial", upload.single("image"), testimonial.addTestimonial);
router.get("/testimonial", testimonial.getTestimonials);
router.get("/testimonial/:id", testimonial.getTestimonial);
router.delete("/testimonial/:id", testimonial.deleteTestimonial);
router.put(
  "/testimonial/:id",
  upload.single("image"),
  testimonial.updateTestimonial
);

module.exports = router;
