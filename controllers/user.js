const User = require("../model/user.js");

module.exports.userSignUpPage = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.userSignUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    // console.log(username,email,password);
    const newUser = new User({
      email: email,
      username: username,
    });
    const result = await User.register(newUser, password);
    req.flash("success", "regester in our database succesfully");
    res.redirect("/listing");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.userLogInPage = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.userLogIn = (req, res) => {
  req.flash("success", "welcome back to homeaway");
  res.redirect("/listing");
};

module.exports.userLogOut = (req, res, next) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
    });
  
    req.flash("success", "user loged out succesfull");
  
    res.redirect("/listing");
  }