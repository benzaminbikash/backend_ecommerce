require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const server = express();
const PORT = process.env.PORT || 5000;

const {
  notFound,
  errorMiddleware,
} = require("./src/middleware/error.middleware");
const categoryRoute = require("./src/routes/category.route");
const productRoute = require("./src/routes/product.route");
const authRoute = require("./src/routes/auth.route");
const contactRoute = require("./src/routes/contact.route");
const testimonialRoute = require("./src/routes/testimonial.route");
const carsoual = require("./src/routes/carsoual.route");
const banner = require("./src/routes/banner.route");
const attribute = require("./src/routes/attribute.route");
const subattribute = require("./src/routes/subattribute.route");
const subcategory = require("./src/routes/subcategory.route");
const contact = require("./src/routes/contact.route");
const address = require("./src/routes/address.route");
const order = require("./src/routes/order.route");
const blog = require("./src/routes/blog.route");
const coupon = require("./src/routes/coupon.route");

// // Middleware
server.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://0.0.0.0:5173",
      "http://192.168.18.70:5173",
    ],
    methods: ["PUT", "GET", "DELETE", "POST"],
    credentials: true,
  })
);
server.use(morgan("dev"));
server.use(express.json());
server.use("/uploads", express.static("uploads"));
server.use(cookieParser());

// app route middleware
server.use("/api/v4", blog);
server.use("/api/v4", coupon);
server.use("/api/v4", categoryRoute);
server.use("/api/v4", productRoute);
server.use("/api/v4", authRoute);
server.use("/api/v4", contactRoute);
server.use("/api/v4", testimonialRoute);
server.use("/api/v4", carsoual);
server.use("/api/v4", banner);
server.use("/api/v4", attribute);
server.use("/api/v4", subattribute);
server.use("/api/v4", subcategory);
server.use("/api/v4", contact);
server.use("/api/v4", address);
server.use("/api/v4", order);

// // Error Middleware
server.use(notFound);
server.use(errorMiddleware);

// mongodb connection
mongoose
  .connect(process.env.MONGODBURL)
  .then(() => {
    server.listen(
      PORT,
      //  "192.168.1.69",
      () => {
        console.log("server listening on: " + PORT);
      }
    );
  })
  .catch((error) => {
    console.log(error);
  });
