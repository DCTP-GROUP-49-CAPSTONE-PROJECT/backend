require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const SERVER_PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/", require("./controllers/user"));
app.use("/", require("./controllers/user_management"));
app.use("/", require("./controllers/provider"));

mongoose.set("bufferCommands", false);

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      socketTimeoutMS: 1000,
    });
    console.log(`connected to db @ ${process.env.MONGODB_URI}`);

    app.listen(SERVER_PORT, () =>
      console.log("Server listening on port " + SERVER_PORT)
    );
  } catch (error) {
    console.log(error);
  }
})();
