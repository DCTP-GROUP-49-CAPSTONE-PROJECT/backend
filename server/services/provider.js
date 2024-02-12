const Provider = require("../models/provider");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// creates a new user
const create = async ({ facilityName, email, password, address }) => {
  try {
    if (await Provider.findOne({ email: email })) {
      return [false, "user already exists, kindly log in."];
    } else {
      const hash = await bcrypt.hash(password, saltRounds);
      const provider = new Provider({
        facilityName: facilityName,
        email: email,
        password: hash,
        address: address,
      });
      if (await provider.save()) {
        return [true, provider];
      }
    }
  } catch (err) {
    return [false, err];
  }
};

/* Return user with specified id */
const getById = async (id) => {
  const provider = await Provider.findById(id);
  return provider;
};

/* Return user with specified email */
const getByEmail = async (email) => {
  const provider = await Provider.findOne({ email: email });
  return provider;
};

/* Return all users */
const getAll = async () => {
  return await Provider.find();
};

// validate provider login request
const validate = async ({ email, password }) => {
  const isValidProvider = await Provider.findOne({ email: email });
  if (isValidProvider) {
    return [
      await bcrypt.compare(password, isValidProvider.password),
      isValidProvider,
    ];
  }
  return false;
};

// updates provider details
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
          avatar: avatar,
          role: role,
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

// changes provider password
const updatePassword = async (password, userId) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);

    const update = await Provider.updateOne(
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
