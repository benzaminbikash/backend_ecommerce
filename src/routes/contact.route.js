const express = require("express");
const router = new express.Router();
const {
  contactMessage,
  getAllContact,
} = require("../controllers/contact.controller");

router.post("/contact", contactMessage);
router.get("/contact", getAllContact);

module.exports = router;
