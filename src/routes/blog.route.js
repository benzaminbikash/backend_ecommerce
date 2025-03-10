const express = require("express");
const blog = require("../controllers/blog.controller");
const router = express.Router();
const { upload } = require("../middleware/upload.middleware");

router.post("/blog", upload.single("image"), blog.addBlog);
router.get("/blog", blog.getBlog);
router.put("/blog/:id", upload.single("image"), blog.updateBlog);
router.delete("/blog/:id", blog.deleteBlog);

module.exports = router;
