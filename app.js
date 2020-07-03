const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const helpershbs = require("handlebars-helpers");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");

//Load config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport); // this (passport) mean passing 'passport' to passport file

connectDB();

const app = express();

//Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//=> only the `string` helpers
// const truncateWords = helpershbs.string();

// Handlebars helper
const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
} = require("./helpers/hbs");

// Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, truncate, stripTags, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global variabel ////////////////
app.use(function (req, res, next) {
  // console.log("RES LOCAL 11", res.locals.user);
  // console.log("RES LOCAL 22", req.user);
  res.locals.user = req.user || null;

  next();
});

// Static folder
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
