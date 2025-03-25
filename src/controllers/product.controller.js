const { authModel } = require("../models/auth.model");
const { productModel } = require("../models/product.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const addProduct = asyncHandler(async (req, res) => {
  const mainimage = req.files?.mainimage[0]?.filename;
  let data = [];
  req.files?.images.map((item) => {
    data.push(item.filename);
  });
  const { title, description, price, category } = req.body;

  if (!title) throw new ApiError("Title is required.", 400);
  const checktitle = await productModel.findOne({ title });
  if (checktitle) throw new ApiError("Title must be unique.");
  if (!description) throw new ApiError("Description is required.", 400);
  if (!price) throw new ApiError("Price is required.", 400);
  if (!category) throw new ApiError("Category is required.");

  const product = await productModel.create({
    ...req.body,
    images: data,
    mainimage: mainimage,
  });
  res.status(201).json(new ApiResponse("Product added successfully.", product));
});

const getProducts = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const excludeField = ["sort", "page", "limit", "fields"];
  excludeField.forEach((item) => delete queryObj[item]);
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  let query = productModel.find(JSON.parse(queryStr));
  if (queryObj.title) {
    query = query.where("title", new RegExp(queryObj.title, "i"));
  }
  if (query.category) {
    query = query.where("category", new RegExp(queryObj.category, "i"));
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  if (req.query.fields) {
    const limitfield = req.query.fields.split(",").join(" ");
    query = query.select(limitfield);
  } else {
    query = query.select("--v");
  }
  const page = req.query.page;
  const limit = req.query.limit;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  if (req.query.page) {
    const countPage = await productModel.countDocuments();
    if (skip >= countPage) {
      throw new Error("No more products");
    }
  }
  const data = await query.populate("category subCategory attributes.title");
  if (data.length === 0) {
    throw new Error("No product in the list");
  } else {
    res.status(200).json({
      status: true,
      message: "All products",
      data: data,
    });
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.id);
  res.status(200).json(new ApiResponse("Single Product.", product));
});

const updateProduct = asyncHandler(async (req, res) => {
  const file = req.file?.filename;
  if (file) {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: file,
      },
      {
        new: true,
      }
    );
    res
      .status(200)
      .json(new ApiResponse("Product updated successfully.", product));
  } else {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res
      .status(200)
      .json(new ApiResponse("Product updated successfully.", product));
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(new ApiResponse("Product delete successfully.", product));
});

const addToCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.body;
  if (!productId) throw new ApiError("Product id is required.");
  const user = await authModel.findById(_id);
  const existproduct = user.cart.find((item) => item.product == productId);
  if (existproduct) throw new ApiError("Product is already in cart", 400);
  await authModel.findByIdAndUpdate(_id, {
    $push: {
      cart: { product: productId, quantity: 1 },
    },
  });
  res.status(200).json(new ApiResponse("Add to cart successfully."));
});
const removeToCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.body;
  if (!productId) throw new ApiError("Product id is required.");
  await authModel.findByIdAndUpdate(_id, {
    $pull: {
      cart: { product: productId, quantity: 0 },
    },
  });
  res.status(200).json(new ApiResponse("Remove cart successfully."));
});

const updateQuantity = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId, quantity } = req.body;
  const user = await authModel.findById(_id);
  if (!productId) throw new ApiError("Product id is required.");
  const product = user.cart.find((item) => item.product == productId);
  if (product) {
    await authModel.findOneAndUpdate(
      { _id, "cart.product": productId },
      {
        $set: {
          "cart.$.quantity": quantity,
        },
      }
    );
    res
      .status(200)
      .json(new ApiResponse("Cart quantity increase successfully."));
  }
});

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addToCart,
  removeToCart,
  updateQuantity,
};
