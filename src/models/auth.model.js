const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
  },
  attributes: [
    {
      title: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
      },
      values: [String],
    },
  ],
});

const authSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (email) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        },
        message: "Email is not valid.",
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (phone) {
          return /^(98|97|96)\d{8}$/.test(phone);
        },
        message: "Phone number is not valid.",
      },
    },
    password: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      enum: ["true", "false"],
      default: "false",
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    cart: {
      type: [cartSchema],
      default: [],
    },

    profilepicture: {
      type: String,
    },
    forgetPassword: {
      otp: {
        type: String,
      },
      otpTime: {
        type: Date,
      },
      verify: {
        type: Boolean,
      },
    },
  },
  {
    timestamps: true,
  }
);

authSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    const bcryptsalt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, bcryptsalt);
  }
});

authSchema.methods.isPasswordMatch = async function (enterPassword) {
  return bcrypt.compare(enterPassword, this.password);
};

authSchema.methods.generateAccesstoken = async function () {
  return jwt.sign(
    { _id: this._id, role: this.role, fullname: this.fullname },
    process.env.Accesstoken,
    {
      expiresIn: process.env.Accesstokenexpiry,
    }
  );
};
authSchema.methods.generaterefreshtoken = async function () {
  return jwt.sign({ _id: this._id }, process.env.Refreshtoken, {
    expiresIn: process.env.Refreshtokenexpiry,
  });
};

const authModel = mongoose.model("User", authSchema);

module.exports = { authModel };
