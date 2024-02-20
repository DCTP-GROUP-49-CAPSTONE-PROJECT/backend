const express = require("express");
const router = express.Router();

const user = require("../services/user");

router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    server: "alive",
  });
});

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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).json(
      JSON.stringify({
        error: "email or  pasword must not be empty",
      })
    );
  } else {
    const data = {
      email: email,
      password: password,
    };
    const findUser = await user.validate(data);

    if (findUser[0]) {
      res.status(200).json(JSON.stringify(findUser));
    } else {
      res.status(401).json(
        JSON.stringify({
          error: "invalid email or password ",
        })
      );
    }
  }
});

router.get("/user", async (req, res) => {
  const { userid } = req.query;
  if (!userid) {
    res.status(401).json({
      error: "userId required",
    });
  }
  const user = await user.getById(userid);
  res.status(200).json(user);
});

module.exports = router;
