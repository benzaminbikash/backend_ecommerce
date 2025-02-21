const express = require("express");
const router = new express.Router();
const order = require("../controllers/order.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth.middleware");
const { upload } = require("../middleware/upload.middleware");

router.get("/order", authMiddleware, adminMiddleware, order.allOrder);
router.post("/order", upload.single("image"), order.postOrder);
router.get("/myorder", authMiddleware, order.userOrder);
router.put("/order/:id", authMiddleware, adminMiddleware, order.updateOrder);

module.exports = router;
