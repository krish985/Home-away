const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const exp = require("constants");
const listingRoutes = require("./routes/listingRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const userRoutes = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategey = require("passport-local");
const User = require("./model/user.js");
const { error } = require("console");
const app = express();
require("dotenv").config();
// const val = process.env.PORT
// console.log(val)

// some configrations.
app.engine("ejs", ejsMate);
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
const store = MongoStore.create({
  mongoUrl:
  process.env.MONGO_URL,
  crypto: {
    secret: "mySuperSecretCode",
  },
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("Eroor in mongo session", error);
});
app.use(
  session({
    store,
    secret: "mySuperSecretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);
app.use(flash());
// passport using for authetication.

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Established database connection.
async function connectDb() {
  const MONGO_URL = process.env.MONGO_URL ;
    await mongoose.connect(MONGO_URL);
}

connectDb()
  .then((response) => {
    console.log("Database connection Established succesfully.");
  })
  .catch((error) => {
    console.log("Error occured to connecting database", error);
  });

// Establish server connection.
const PORT = 8080;
app.listen(PORT, (req, res) => {
  console.log(`Server listening on port no : ${PORT}`);
});

app.use("/listing", listingRoutes);
app.use("/listing/:id", reviewRoutes);
app.use("/", userRoutes);
// entry page of website.
app.get('/',(req,res)=>{
  res.render('listings/entry.ejs')
})

// adiing middlewares.
// error handling middleware.
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).send(message);
  next(err);
});

//page not found middleware.
app.use((req, res) => {
  res.render("listings/404Error.ejs");
});
