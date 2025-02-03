const express = require("express");
const router = new express.Router();
const { contactMessage } = require("../controllers/contact.controller");

router.post("/contact", contactMessage);

module.exports = router;
