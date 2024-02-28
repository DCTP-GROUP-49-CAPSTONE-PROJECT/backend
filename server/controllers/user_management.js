const router = require("express").Router();
const user = require("../services/user");
const jwt = require("jsonwebtoken");
const mailUser = require("../services/sendMail");
const { imageFilter } = require("./helpers");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir("./uploads/", (err) => {
      cb(null, "./uploads/");
    });
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});
const maxSize = 1 * 1024 * 1024; // for 1MB

const JWT_SECRET = process.env.JWT_SECRET;

let upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: maxSize,
}).single("avatar");
router.post("/user/update", async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({
        error: "uanable to upload try again",
      });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(401).json({
        error: err.message,
      });
    }
    const {
      email,
      gender,
      weight,
      bloodGroup,
      genoType,
      address,
      phoneNumber,
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
      return res.status(401).json(
        JSON.stringify({
          error: "ensure all fields are filled",
        })
      );
    }

    if (req.file && req.file.size > maxSize) {
      return res.status(401).json(
        JSON.stringify({
          error: `upload image must not exceed ${maxSize} got ${req.file.size}`,
        })
      );
    }

    // getting the original img data in case user did not upload new one
    const userFromDb = await user.getByEmail(email);
    const originalImgData = userFromDb.avatar.data;
    // saving image to an object to be uploaded to db if upload is successful
    const imgObj = {
      avatar: {
        data: req.file
          ? fs.readFileSync(path.resolve("./uploads/" + req.file.filename))
          : originalImgData || fs.readFileSync("./public/assets/avatar2.jpg"),
        contentType: req.file ? req.file.mimetype : "image/png",
      },
    };

    const data = {
      email: email,
      gender: gender,
      weight: weight,
      bloodGroup: bloodGroup,
      genoType: genoType,
      address: address,
      phoneNumber: phoneNumber,
      avatar: imgObj,
    };
    const updateUser = await user.updateDetails(data);
    if (updateUser[0]) {
      return res.status(201).json(JSON.stringify(updateUser));
    } else {
      return res.status(400).json(
        JSON.stringify({
          error: "an error occured",
        })
      );
    }
  });
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
    const link = `https://lifeplus-api.onrender.com/user/reset-password/${userFromDB._id}/${token}`;

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

    res.redirect(`https://life-plus-webapp.vercel.app/new-password/?${id}`);
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

router.delete("/user/delete", async (req, res) => {
  const { email } = req.body;
  const deletUser = user.deleteOne(email);
  res.status(200).json({
    ok: "user removed",
  });
});

module.exports = router;
