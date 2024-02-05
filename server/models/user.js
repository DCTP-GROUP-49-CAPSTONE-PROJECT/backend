const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const UserSchema = new Schema(
  {
    firstName: { type: "String", required: true },
    lastName: { type: "String", required: true },
    email: { type: "String", unique: true },
    password: { type: "String" },
  },
  { timestamps: true }
);

const User = mongoose.model("users", UserSchema);

module.exports = User;
