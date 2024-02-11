const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const UserSchema = new Schema(
  {
    fullName: { type: "String", required: true },
    email: { type: "String", unique: true },
    password: { type: "String" },
    gender: { type: "String" },
    weight: { type: "String" },
    bloodGroup: { type: "String" },
    genoType: { type: "String" },
    address: { type: "String" },
    phoneNumber: { type: "String" },
    role: { type: "String" },
    avatar: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", UserSchema);

module.exports = User;
