const express = require("express");
const router = new express.Router();
const auth = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const address = require("../controllers/address.controller");

router.use(authMiddleware);

router.route("/address").post(address.addAddress).get(address.getAddress);
router
  .route("/address/:id")
  .put(address.updateAddress)
  .get(address.deleteAddress);

module.exports = router;
