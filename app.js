const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const errorPage = require("./controllers/404");
const mongoose = require("mongoose");
const User = require("./models/user");
const { doubleCsrf: csrf } = require("csrf-csrf");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const MongoDBStore = require("connect-mongodb-session")(session);
const app = express();
const store = new MongoDBStore({
  uri: "mongodb+srv://dianasancheztorres93:kpKKZBSRucrXZejb@cluster0.4qjlipp.mongodb.net/",
  collection: "sessions",
});

app.use(bodyParser.urlencoded({ extended: false }));

//For CSS Path
app.use(express.static(path.join(__dirname, "public")));

// CSRF Sync CommonJS

const csrfProtection = csrf({
  getSecret: () => "supersecret",
  getCsrfTokenFromRequest: (req) => {
    return req.body._csrf || req.headers["x-csrf-token"];
  },
  // __HOST and __SECURE are blocked in chrome, change name
  getSessionIdentifier: (req) => req.session.id,
  cookieName: "__Academ-psifi.x-csrf-token",
  cookieOptions: { secure: false, httpOnly: false },
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

//Express Session Initialization

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: false,
    },
  })
);

//Using CSRF Protection
//Using the middleware

app.use(cookieParser("supersecret"));
app.use(csrfProtection.doubleCsrfProtection);
//Declaring variables
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();

  next();
});

//Checking for user

app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.use(authRoutes);
app.use(shopRoutes);
app.use("/admin", adminRoutes);
app.use(errorPage.getErrorPage);

//Initializing Server

(async function () {
  try {
    await mongoose.connect(
      "mongodb+srv://dianasancheztorres93:kpKKZBSRucrXZejb@cluster0.4qjlipp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
})();
