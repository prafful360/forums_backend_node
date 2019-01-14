const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jasonwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../setup/dburl");

//@type     -   GET
//@route    -   /api/auth
//@access   -   PUBLIC
router.get("/", (req, res) => {
  res.json({ test: "Auth is being tested" });
});

//Import Schema for Person to Register
const Person = require("../../models/Person");

//@type     -   POST
//@route    -   /api/auth/register
//@desc     -   route for registration
//@access   -   PUBLIC
router.post("/register", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then(person => {
      if (person) {
        return res
          .status(400)
          .json({ emailerroror: "Email is already registered" });
      } else {
        const newPerson = new Person({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        //Encrypt Password using BcryptJS

        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(newPerson.password, salt, (erroror, hash) => {
            if (error) throw error;
            newPerson.password = hash;
            newPerson
              .save()
              .then(person => res.json(person))
              .catch(error => console.log(error));
          });
        });
      }
    })
    .catch(error => console.log(error));
});
//@type     -   POST
//@route    -   /api/auth/login
//@desc     -   route for login
//@access   -   PUBLIC
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  Person.findOne({ email })
    .then(person => {
      if (!person) {
        return res.status(404).json({ emailerror: "User not Exist" });
      }
      bcrypt
        .compare(password, person.password)
        .then(isCorrect => {
          if (isCorrect) {
            //res.json({ success: "User is logging in" });
            //Payload definition
            const payload = {
              id: person.id,
              name: person.name,
              email: person.email,
              profilepic: person.profilepic
              //gender: person.gender
            };
            //Use payload and create tken for user
            jasonwt.sign(
              payload,
              key.secret,
              { expiresIn: 3600 },
              (error, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              }
            );
          } else {
            res.status(404).json({ passworderror: "Incorrect Password" });
          }
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
});
// @type    GET
//@route    /api/auth/profile
// @desc    route for user profile
// @access  PRIVATE

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log(req);
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profilepic: req.user.profilepic
    });
  }
);

module.exports = router;
