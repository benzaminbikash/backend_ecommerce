const express = require("express");
const router = new express.Router();
const auth = require("../controllers/auth.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth.middleware");

// register and login
router.route("/registration").post(auth.registration);
router.route("/login").post(auth.login);
router.route("/login-admin").post(auth.loginAdmin);

// information
router.get("/allusers", authMiddleware, adminMiddleware, auth.getUsersByAdmin);
router.get("/user", authMiddleware, auth.userInfo);

// update
router.put("/user", authMiddleware, auth.updateProfile);

// forget password
router.post("/forget-password", auth.forgetPassword);
router.post("/otp-verify", auth.otpVerify);
router.post("/change-password", auth.changePassword);

// delete by admin
router.delete("/user/:id", authMiddleware, adminMiddleware, auth.deleteUser);

module.exports = router;
