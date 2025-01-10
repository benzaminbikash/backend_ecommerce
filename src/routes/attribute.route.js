const express = require("express");
const attribute = require("../controllers/attribute.controller");
const router = new express.Router();

router.route("/attribute").post(attribute.addAttribute);
router.route("/attribute").get(attribute.getAllAttribute);
router.route("/attribute/:id").put(attribute.updateAttribute);
router.route("/attribute/:id").delete(attribute.deleteAttribute);

module.exports = router;
