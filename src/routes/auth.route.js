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
router.route("/refresh").post(auth.refresh);
router.route("/logout").get(auth.logout);

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

// cart
router.route("/cart").post(authMiddleware, auth.addCart);
router.route("/removecart").post(authMiddleware, auth.removeCart);
router.route("/cart-increase").post(authMiddleware, auth.increaseCart);
router.route("/cart-decrease").post(authMiddleware, auth.decreaseCart);
router.route("/cart-empty").get(authMiddleware, auth.emptyCart);

module.exports = router;
