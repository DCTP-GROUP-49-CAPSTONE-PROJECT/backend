require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "mySessions",
});
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

app.use(
  session({
    secret: "secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store,
    resave: false,
    saveUninitialized: true,
  })
);
// initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname));
app.use("/", require("./controllers/user_management"));
app.use("/", require("./controllers/user"));
app.use("/", require("./controllers/provider"));
app.use("/", require("./controllers/blood_drive"));
const passportSetup = require("./config/passport-setup");
const User = require("./models/user");
app.use("/auth", require("./controllers/auth-routes"));
app.use("/", require("./controllers/schedule"));
app.use("/", require("./controllers/discussion"));
app.use("/", require("./controllers/comment"));
app.use("/", require("./controllers/like_comment"));

mongoose.set("bufferCommands", false);

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      socketTimeoutMS: 40000,
    });
    console.log(`connected to db @ ${process.env.MONGODB_URI}`);

    app.listen(SERVER_PORT, () =>
      console.log("Server listening on port " + SERVER_PORT)
    );
  } catch (error) {
    console.log(error);
  }
})();
