const express = require("express");
const router = express.Router();

const user = require("../services/user");

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    res.status(400).json({
      error: "one or more field is not filled",
    });
  } else {
    const data = {
      fullName: fullName,
      email: email,
      password: password,
    };
    const newUser = await user.create(data);
    if (newUser[1]) {
      newUser[1].password = password;
      res.status(201).json(JSON.stringify(newUser));
    } else {
      res.status(400).json(JSON.stringify(newUser));
    }
  }
});

module.exports = router;
