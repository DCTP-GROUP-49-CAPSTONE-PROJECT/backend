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

/* Return user with specified id */
const getById = async (id) => {
  const user = await User.findById(id);
  return user;
};

/* Return user with specified email */
const getByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  return user;
};

/* Return all users */
const getAll = async () => {
  return await User.find();
};

// validate user login request
const validate = async ({ email, password }) => {
  const isValidUser = await User.findOne({ email: email });
  if (isValidUser && isValidUser.googleId) {
    return [
      "google user",
      "This account was created with google, kindly log in with google or reset password to create a new password",
    ];
  } else if (isValidUser) {
    return [await bcrypt.compare(password, isValidUser.password), isValidUser];
  }
  return false;
};

// updates user details
const updateDetails = async ({
  email,
  gender,
  weight,
  bloodGroup,
  genoType,
  address,
  phoneNumber,
  avatar,
}) => {
  try {
    const update = await User.updateOne(
      { email: email },
      {
        $set: {
          gender: gender,
          weight: weight,
          bloodGroup: bloodGroup,
          genoType: genoType,
          address: address,
          phoneNumber: phoneNumber,
          accountUpdated: true,
          avatar: avatar.avatar,
        },
      }
    );

    if (update.acknowledged) {
      return [
        true,
        "user details updated successfully",
        await User.findOne({ email: email }),
      ];
    }
    return [false, "an error occured"];
  } catch (error) {
    console.log(error);
  }
};

// changes user password
const updatePassword = async (password, userId) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);

    const update = await User.updateOne(
      { _id: userId },
      {
        $set: {
          password: hash,
        },
      }
    );
    if (update.acknowledged) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  create,
  validate,
  updateDetails,
  getById,
  getByEmail,
  getAll,
  updatePassword,
};
