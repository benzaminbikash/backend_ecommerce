const express = require("express");
const subattribute = require("../controllers/subattribute.controller");
const router = new express.Router();

router.post("/subattribute", subattribute.addSubAttribute);
router.get("/subattribute", subattribute.getsubAttributes);
router.delete("/subattribute/:id", subattribute.deletesubAttributes);
router.put("/subattribute/:id", subattribute.updatesubAttributes);

module.exports = router;
