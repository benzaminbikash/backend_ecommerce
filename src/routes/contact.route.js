const express = require("express");
const router = new express.Router();
const { contactAdd } = require("../controllers/contact.controller");

router.post("/contact", contactAdd);

module.exports = router;
