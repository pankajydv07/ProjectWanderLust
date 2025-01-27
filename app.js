if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
// Connect to MongoDB


main()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

  async function main() {
    await mongoose.connect(process.env.DB_URL);
  }

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",()=>{
  console.log("Session Store Error");
});

const sessionOptions ={
  store,
  secret:process.env.SECRET,
  saveUninitialized:true,
  resave:false,
  cookie:{
    expires: Date.now() + 7 * 24 * 3600 * 1000,
    maxAge:7 * 24 * 3600 * 1000,
    httpOnly:true
  }
};

// app.get("/", (req, res) => {
//   res.send("Working");
// });



app.use(session(sessionOptions));
app.use(flash());

//authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"pankaj@mail.com",
//     username:"piku"
//   });
//   let registereduser = await User.register(fakeUser,"pankaj");
//   res.send(registereduser);
// });

// Routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);




app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
})
// General Error Handling Middleware
app.use((err, req, res, next) => {
  res.render("error.ejs",{err});
  //res.status(code).send(message);
});

// Start Server
app.listen(8080, () => {
  console.log("Listening on port 8080");
});
