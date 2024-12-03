const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const passport = require("passport");
const userControllers = require('../controllers/user.js');

router.get("/signup",userControllers.userSignUpPage);

router.post(
  "/signup",
  asyncWrap(userControllers.userSignUp)
);

router.get("/login", userControllers.userLogInPage);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userControllers.userLogIn
);

router.get("/logout", userControllers.userLogOut);

module.exports = router;
