const express = require("express");
const router = new express.Router();
const contact = require("../controllers/contact.controller");

router.post("/contact", contact.contactMessage);
router.get("/contact", contact.getAllContact);
router.delete("/contact/:id", contact.deleteContact);

module.exports = router;
