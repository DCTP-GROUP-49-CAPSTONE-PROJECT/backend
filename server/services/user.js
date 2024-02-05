const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// creates a new user
const create = async ({ firstName, lastName, email, password }) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      firstName: firstName,
      lastName: lastName,
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

module.exports = {
  create,
};
