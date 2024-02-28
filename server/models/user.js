const mongoose = require("mongoose");
const { Schema } = mongoose;

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
    accountUpdated: { type: "Boolean", default: false },
    phoneNumber: { type: "String" },
    googleId: { type: "String" },
    thumbnail: {
      data: Buffer,
      contentType: String,
    },
    avatar: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", UserSchema);

module.exports = User;
