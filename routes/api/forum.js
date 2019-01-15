const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Person Model
const Person = require("../../models/Person");
//Load Profile Model
const Profile = require("../../models/Profile");
//Load Question Model
const Question = require("../../models/Question");

// @type    GET
//@route    /api/questions/
// @desc    route for Displaying all Questions in the Forum
// @access  PUBLIC
router.get("/", (req, res) => {
  Question.find()
    .sort({ date: "desc" })
    .then(question => res.json(question))
    .catch(error => console.log(error));
});

// @type    POST
//@route    /api/forum/
// @desc    route for submitting questions
// @access  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newQuestion = new Question({
      textone: req.body.textone,
      texttwo: req.body.texttwo,
      user: req.body.id,
      name: req.body.name
    });
    newQuestion
      .save()
      .then(question => res.json(question))
      .catch(error => console.log(error));
  }
);
// @type    POST
//@route    /api/forum/answers/:id
// @desc    route for submitting answers to questions
// @access  PRIVATE
router.post(
  "/answer/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findById(req.params.id)
      .then(question => {
        const newAnswer = {
          user: req.user.id,
          name: req.body.name,
          text: req.body.text
        };
        question.answers.unshift(newAnswer);
        question
          .save()
          .then(question => req.json(question))
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  }
);
// @type    POST
//@route    /api/forum/upvote/:id
// @desc    route for submitting upvote to questions(exactly)
// @access  PRIVATE
router.post(
  "/upvote/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne(req.user.id)
      .then(profile => {
        Question.findById(req.params.id)
          .then(question => {
            if (
              question.upvotes.filter(
                upvote => upvote.user.toString() === req.user.id.toString()
              ).length > 0
            ) {
              return res.status(400).json({ noupvote: "User already upvoted" });
            }
            question.upvotes.unshift({ user: req.user.id });
            question
              .save()
              .then(question => res.json(question))
              .catch(error => console.log(error));
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  }
);
// @type    POST
//@route    /api/forum/delete/:id
// @desc    route for deleting questions(exactly)
// @access  PRIVATE
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findByIdAndRemove(req.params.id)
      .then(question => {
        res.json({ success: "question deleted" });
      })
      .catch(error => console.log(error));
  }
);
module.exports = router;
