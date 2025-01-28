const { authModel } = require("../models/auth.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { emailConfig } = require("../utils/emailConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  const exituser = await authModel.findOne({ email: email });
  if (exituser) throw new ApiError("Email already exits.");
  const user = await authModel.create({
    email,
    fullname,
    password,
    phone,
    term,
    role,
  });
  res
    .status(201)
    .json(new ApiResponse("User registration successfully.", user));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError("Email and password are required.");
  const existuser = await authModel.findOne({ email });
  if (existuser && (await existuser.isPasswordMatch(password))) {
    const token = await existuser.generateAccesstoken();
    const refreshtoken = await existuser.generaterefreshtoken();
    res.status(200).json({
      accessToken: token,
      refreshToken: refreshtoken,
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

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError("Email and password are required.");
  const existuser = await authModel.findOne({ email });
  if (existuser && (await existuser.isPasswordMatch(password))) {
    if (existuser.role != "admin") {
      throw new ApiError("You are not admin", 400);
    } else {
      const accessToken = await existuser.generateAccesstoken();
      const refreshtoken = await existuser.generaterefreshtoken();
      res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshtoken,
      });
    }
  } else {
    throw new ApiError("Invalid credential.", 400);
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
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
    <div style="text-align: center;">
      <img src="https://r2.erweima.ai/imgcompressed/compressed_b10c65c02342a7b502db4a7c4a6e9c40.webp" alt="Company Logo" style="width: 100px; margin-bottom: 20px;">
    </div>
    <h2 style="color: #333; text-align: center;">Password Recovery</h2>
    <p style="font-size: 16px; color: #555; text-align: center;">
      Hi there! You requested to reset your password. Your 4-digit OTP is below:
    </p>
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
      <p style="font-size: 30px; color: #e67e22; font-weight: bold;">${otp}</p>
    </div>
    <p style="font-size: 16px; color: #555; text-align: center;">
      This OTP is valid for <strong>5 minutes</strong> only. If you did not request this, please ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
  </div>
`;
  await emailConfig(user.email, "Did you forget your password?", html);
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

module.exports = {
  registration,
  login,
  getUsersByAdmin,
  userInfo,
  updateProfile,
  loginAdmin,
  forgetPassword,
  otpVerify,
  changePassword,
  deleteUser,
  refresh,
  logout,
};
