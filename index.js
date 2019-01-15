const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");

//Bring all routes
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const question = require("./routes/api/question");

const app = express();
const port = process.env.PORT || 3000;

//Middleware for Body-Parser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//mongoDb Configuration
const db = require("./setup/dburl").mongoURL;

//Attempt to connect to database
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected!"))
  .catch(error => console.log(error));

//passport middleware
app.use(passport.initialize());

//Config for JWT Strategy
require("./strategy/jsonwebstrategy")(passport);

//@route    -   GET  /
//@desc     -   Route to homepage
//@access   -   PUBLIC
app.get("/", (req, res) => {
  res.send("Hello My Nodejs");
});

//Actual Routes
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/forum", question);

app.listen(port, () => console.log("Server is running....."));
