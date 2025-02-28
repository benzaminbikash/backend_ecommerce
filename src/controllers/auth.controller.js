const { authModel } = require("../models/auth.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { emailConfig } = require("../utils/emailConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OTPMessage, verifyAccount } = require("../utils/Message");

const registration = asyncHandler(async (req, res) => {
  const { email, password, fullname, confirmationpassword, phone, term, role } =
    req.body;
  if (!fullname) throw new ApiError("Fullname is required.", 400);
  if (!email) throw new ApiError("Email is required.", 400);
  if (!phone) throw new ApiError("Phone is required.", 400);
  if (!password) throw new ApiError("Password is required.", 400);
  if (!confirmationpassword)
    throw new ApiError("Confirmation Password is required.", 400);
  if (password !== confirmationpassword)
    throw new ApiError("Password and confirmation password are not match.");
  const existUser = await authModel.findOne({ email });
  if (existUser) throw new ApiError("Email already exits.");

  let otprandom = Math.floor(Math.random() * 9999);
  const otp = otprandom.toString().padEnd(4, "0");
  const time = new Date(Date.now() + 5 * 60 * 1000);
  const user = await authModel.create({
    email,
    fullname,
    password,
    phone,
    term,
    role,
    otp: otp,
    otpexpiry: time,
  });
  await emailConfig(email, "Verify your account.", verifyAccount(otp));
  res
    .status(201)
    .json(
      new ApiResponse(
        "User registration successfully, Please Verify Your Account.",
        user
      )
    );
});

const verifyUserAccount = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (!otp) throw new ApiError("OTP is required.");
  const user = await authModel.findOne({ otp });
  if (!user) throw new ApiError("OTP is not corrected.");
  if (user.otpexpiry < Date.now()) throw new ApiError("Otp is expiry.");
  user.isVerify = true;
  user.otp = null;
  user.otpexpiry = null;
  res
    .status(200)
    .json(new ApiResponse("Your account is verified successfully."));
});

const resendOtpforVerify = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await authModel.findOne({ email });
  if (user.isVerify) throw new ApiError("Your account is already verified.");
  let otprandom = Math.floor(Math.random() * 9999);
  const otp = otprandom.toString().padEnd(4, "0");
  const time = new Date(Date.now() + 5 * 60 * 1000);
  user.otp = otp;
  user.otpexpiry = time;
  await user.save();
  await emailConfig(email, "Verify your account.", verifyAccount(otp));
  res
    .status(200)
    .json(new ApiResponse("Please check your email address for otp."));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError("Email and password are required.");
  const existuser = await authModel.findOne({ email });
  if (existuser && (await existuser.isPasswordMatch(password))) {
    const token = await existuser.generateAccesstoken();
    const refreshtoken = await existuser.generaterefreshtoken();
    const user = await authModel
      .findById(existuser._id)
      .select("-password -term -cart -forgetPassword");
    res.status(200).json({
      accessToken: token,
      refreshToken: refreshtoken,
      data: user,
    });
  } else {
    throw new ApiError("Invalid credential.", 404);
  }
});

const refresh = asyncHandler(async (req, res) => {
  const cookies = req.body.refreshToken;
  console.log("cookies", cookies);
  if (!cookies) throw new ApiError("Not authorized/No Refresh Token.", 400);
  try {
    const decoded = jwt.verify(cookies, process.env.Refreshtoken);
    const user = await authModel.findById(decoded._id);
    if (!user) throw new ApiError("User not found", 404);
    const accessToken = await user.generateAccesstoken();
    const refreshToken = await user.generaterefreshtoken();
    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError("Refresh token expired.", 403);
    } else if (error.name === "JsonWebTokenError") {
      throw new ApiError("Token is not valid.", 403);
    } else {
      throw new ApiError("An unknown error occurred.", 500);
    }
  }
});

const getUsersByAdmin = asyncHandler(async (req, res) => {
  const user = await authModel.find().select("-password");
  res.status(200).json(new ApiResponse("All users", user));
});

const userInfo = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await authModel
    .findById(_id)
    .select("-password")
    .populate("cart.product");
  res.status(200).json(new ApiResponse("Your data", user));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await authModel.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  res.status(200).json(new ApiResponse("Update Profile", user));
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  let otprandom = Math.floor(Math.random() * 9999);
  const otp = otprandom.toString().padEnd(4, "0");
  const time = new Date(Date.now() + 5 * 60 * 1000);
  if (!email) throw new ApiError("Email is required.");
  const user = await authModel.findOne({ email });
  if (!user) throw new ApiError("Email is not registered in the system.");
  await authModel.findByIdAndUpdate(user._id, {
    $set: {
      "forgetPassword.otp": otp,
      "forgetPassword.otpTime": time,
    },
  });

  await emailConfig(
    user.email,
    "Did you forget your password?",
    OTPMessage(otp)
  );
  res.status(200).json(new ApiResponse("Please check the mail."));
});

const otpVerify = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (!otp) throw new ApiError("Otp is required.", 400);
  const user = await authModel.findOne({ "forgetPassword.otp": otp });
  if (!user) throw new ApiError("Otp is not valid.", 400);
  const currenttime = new Date();
  if (user.forgetPassword.otpTime < currenttime) {
    throw new ApiError("The time for otp is already finished.", 400);
  } else {
    await authModel.findByIdAndUpdate(user._id, {
      $set: {
        "forgetPassword.verify": true,
      },
    });
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        "Otp verification successfully, now you can change your password."
      )
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const { password, confirmationpassword, email } = req.body;
  if (!password || !confirmationpassword)
    throw new ApiError("Password and confirmation password are required.");
  if (password != confirmationpassword)
    throw new ApiError("Password and confirmation password must be match.");
  if (!email) throw new ApiError("Email is required.");
  const user = await authModel.findOne({ email });
  if (!user) throw new ApiError("User not found.");
  if (!user.forgetPassword.verify)
    throw new ApiError("Otp has not been verified.", 400);
  const isPasswordSame = await bcrypt.compare(password, user.password);
  if (isPasswordSame)
    throw new ApiError(
      "New password is same as old password. Please write new one. "
    );
  const hashpassword = await bcrypt.hash(password, 10);
  await authModel.findByIdAndUpdate(user._id, {
    $set: {
      password: hashpassword,
      forgetPassword: {
        otp: null,
        otpTime: null,
        verify: false,
      },
    },
  });
  res.status(200).json(new ApiResponse("Password changed successfully."));
});

const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log("ID of delete user", id);
  const user = await authModel.findByIdAndDelete(id);
  res.status(200).json(new ApiResponse("User Deleted successfully.", user));
};

const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res
    .clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    })
    .status(200)
    .json(new ApiResponse("Logout Successfully."));
});
const addCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { product, quantity, attributes } = req.body;
  if (!product) throw new ApiError("Product is required.", 400);
  if (!quantity || quantity <= 0)
    throw new ApiError("Quantity must be greater than 0.", 400);
  const user = await authModel.findById(_id);
  if (!user) throw new ApiError("User not found.", 404);
  const existProduct = user.cart.find(
    (item) => item.product.toString() === product
  );
  if (existProduct) {
    throw new ApiError("Product already in cart.", 400);
  }
  user.cart.push({
    product: product,
    quantity: quantity,
    attributes: attributes,
  });
  await user.save();
  res.status(200).json(new ApiResponse("Product added to cart successfully."));
});

const removeCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { product } = req.body;
  if (!product) throw new ApiError("Product is required.", 400);
  const user = await authModel.findById(_id);
  const existProduct = user.cart.find(
    (item) => item.product.toString() === product
  );
  if (existProduct) {
    user.cart.pull({
      product: product,
    });
  }
  await user.save();
  res.status(200).json(new ApiResponse("Product remove from the cart."));
});

const increaseCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { product } = req.body;
  if (!product) throw new ApiError("Product is required.", 400);
  const user = await authModel.findById(_id);
  if (!user) throw new ApiError("User not found.", 404);
  const existProduct = user.cart.find(
    (item) => item.product.toString() === product
  );
  existProduct.quantity += 1;
  await user.save();
  res.status(200).json(new ApiResponse("Product Quantity Increased."));
});

const decreaseCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { product } = req.body;
  if (!product) throw new ApiError("Product is required.", 400);
  const user = await authModel.findById(_id);
  if (!user) throw new ApiError("User not found.", 404);
  const existProduct = user.cart.find(
    (item) => item.product.toString() === product
  );
  existProduct.quantity -= 1;
  await user.save();
  res.status(200).json(new ApiResponse("Product Quantity Decreased."));
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await authModel.findById(_id);
  user.cart = [];
  await user.save();
  res
    .status(200)
    .json(new ApiResponse("Your cart is empty after order products."));
});

const passwordChangeFromOld = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await authModel.findById(_id);
  const { oldpassword, password, confirmationpassword } = req.body;
  if (password != confirmationpassword)
    throw new ApiError("Password and confirmation password are not match.");
  if (password.length < 6 || confirmationpassword < 6)
    throw new ApiError("Password length must be greater than 6.", 400);
  const comparepassword = await bcrypt.compare(oldpassword, user.password);
  if (comparepassword) {
    user.password = password;
    user.save();
    return res.status(200).json({
      message: "Password Change Successfully.",
    });
  } else {
    return res.status(400).json({
      message: "Old password is not correct.",
    });
  }
});

module.exports = {
  registration,
  login,
  getUsersByAdmin,
  userInfo,
  updateProfile,
  forgetPassword,
  otpVerify,
  changePassword,
  deleteUser,
  refresh,
  logout,
  addCart,
  removeCart,
  increaseCart,
  decreaseCart,
  emptyCart,
  passwordChangeFromOld,
  verifyUserAccount,
  resendOtpforVerify,
};
