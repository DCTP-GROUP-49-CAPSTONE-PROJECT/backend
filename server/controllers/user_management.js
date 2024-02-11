const router = require("express").Router();
const user = require("../services/user");
const persistId = require("../helpers/persistUserID");
const jwt = require("jsonwebtoken");
const mailUser = require("../services/sendMail");

// implementation copied from https://github.com/trulymittal/forgot-password/blob/master/app.js

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/user/update", async (req, res) => {
  const {
    email,
    gender,
    weight,
    bloodGroup,
    genoType,
    address,
    phoneNumber,
    avatar,
  } = req.body;
  if (
    !email ||
    !gender ||
    !weight ||
    !bloodGroup ||
    !genoType ||
    !address ||
    !phoneNumber
  ) {
    res.status(401).json(
      JSON.stringify({
        error: "ensure all fields are filled",
      })
    );
  } else {
    const data = {
      email: email,
      gender: gender,
      weight: weight,
      bloodGroup: bloodGroup,
      genoType: genoType,
      address: address,
      phoneNumber: phoneNumber,
      avatar: avatar,
    };
    const updateUser = await user.updateDetails(data);
    if (updateUser[0]) {
      res.status(201).json(JSON.stringify(updateUser));
    } else {
      res.status(400).json(
        JSON.stringify({
          error: "an error occured",
        })
      );
    }
  }
});

router.post("/user/forgot-password", async (req, res, _next) => {
  const { email } = req.body;
  const userFromDB = await user.getByEmail(email);
  // Make sure user exist in database
  if (userFromDB) {
    // User exist and now we'll create a One time link valid for 30minutes using jsonweb tokens
    const secret = JWT_SECRET + userFromDB.password;
    const payload = {
      email: userFromDB.email,
      id: userFromDB._id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "30m" });
    const link = `http://localhost:3000/user/reset-password/${userFromDB._id}/${token}`;

    //Send link to the user's email using node-mailjet module
    mailUser.sendMail(userFromDB.email, userFromDB.fullName, link);
    res.status(200).json(
      JSON.stringify({
        ok: "An email with password reset instructions has been sent to the email you provided",
      })
    );
  } else {
    res.status(401).json(
      JSON.stringify({
        error:
          "Oops! we cant find an account assocciated with that email from our records",
      })
    );
  }
});

// get link when user click link from email
router.get("/user/reset-password/:id/:token", async (req, res, _next) => {
  const { id, token } = req.params;
  const userFromDB = await user.getById(id);
  // Check if this id exist in database
  if (userFromDB === null) {
    let error = ["error User not recognized"];
    error = JSON.stringify(error);
    res.status(400).json(error);
    return;
  }

  // We have a valid id, and we have a valid user with this id
  const secret = JWT_SECRET + userFromDB.password;
  try {
    // verify token

    res.redirect(`https://life-plus-webapp.vercel.app/?${id}`);
  } catch (error) {
    console.log(error.message);
    res.send("<strong>link expired or timed out</strong>");
  }
});

router.post("/user/reset-password/:id", async (req, res, _next) => {
  const { password, confirmPassword } = req.body;
  const { id } = req.params;
  try {
    // validate password and password2 should match
    if (password !== confirmPassword) {
      res.status(401).json(
        JSON.stringify({
          error: "password mismatch, retry",
        })
      );
      return;
    }

    const update = await user.updatePassword(password, id);
    if (update) {
      res.status(200).json(
        JSON.stringify({
          success: "password reset successfully",
        })
      );
    } else {
      res.status(400).json(
        JSON.stringify({
          error: "an error occured",
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
