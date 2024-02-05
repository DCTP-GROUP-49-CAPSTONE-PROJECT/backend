const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// creates a new user
const create = async ({ fullName, email, password }) => {
  try {
    if (await User.findOne({ email: email })) {
      return [false, "user already exists, kindly log in."];
    }
    const hash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      fullName: fullName,
      email: email,
      password: hash,
    });
    if (await user.save()) {
      return [true, user];
    }
  } catch (err) {
    return [false, err];
  }
};

// validate user login request
const validate = async ({ email, password }) => {
  const isValidUser = await User.findOne({ email: email });
  if (isValidUser) {
    return await bcrypt.compare(password, isValidUser.password);
  }
  return false;
};

module.exports = {
  create,
  validate,
};
