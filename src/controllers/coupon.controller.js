const couponModel = require("../models/coupon.model");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const addCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponModel.create(req.body);
  res.status(201).json(new ApiResponse("Coupon created successfully.", coupon));
});
const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponModel.find();
  res.status(200).json(new ApiResponse("All coupons", coupon));
});
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(new ApiResponse("Coupon updated successfully.", coupon));
});
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponModel.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse("Coupon delete successfully", coupon));
});

module.exports = { addCoupon, getCoupon, updateCoupon, deleteCoupon };
