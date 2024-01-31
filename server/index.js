require("dotenv").config();
const express = require("express");

const app = express();

const SERVER_PORT = process.env.PORT;
const HOST = process.env.HOST;

app.listen(SERVER_PORT, () =>
  console.log("Server listening on port " + SERVER_PORT)
);
