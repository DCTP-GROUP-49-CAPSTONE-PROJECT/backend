const express = require("express");
const router = express.Router();

const provider = require("../services/provider");

router.post("/provider/signup", async (req, res) => {
  const { facilityName, email, password, address } = req.body;

  if (!facilityName || !email || !password) {
    res.status(400).json({
      error: "one or more field is not filled",
    });
  } else {
    const data = {
      facilityName: facilityName,
      email: email,
      password: password,
      address: address,
    };
    const newProvider = await provider.create(data);
    console.log(newProvider);
    if (newProvider[0]) {
      res.status(201).json(JSON.stringify(newProvider));
    } else {
      res.status(400).json(JSON.stringify(newProvider));
    }
  }
});

router.post("/provider/login", async (req, res) => {
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
    const findProvider = await provider.validate(data);

    if (findProvider[0]) {
      res.status(200).json(JSON.stringify(findProvider));
    } else {
      res.status(401).json(
        JSON.stringify({
          error: "invalid email or password ",
        })
      );
    }
  }
});
router.post("/provider/get-single", async (req, res) => {
  const { providerId } = req.query;
  if (!providerId) {
    res.status(401).json(
      JSON.stringify({
        error: "proivderId must not be empty",
      })
    );
  } else {
    const findProvider = await provider.getById(providerId);

    if (findProvider) {
      res.status(200).json(findProvider);
    } else {
      res.status(401).json(
        JSON.stringify({
          error: "Provider does not exist",
        })
      );
    }
  }
});

module.exports = router;
