const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  //const isLoggedIn = req.get("cookie").split("=")[1];
  res.render("auth/login", {
    docTitle: "Login",
    isAuth: false,
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user) return res.redirect("/login");
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      req.session.user = user;
      req.session.isLoggedIn = true;
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};

exports.postLogOut = async (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  console.log(res.locals.csrfToken);
  res.render("auth/signup", { docTitle: "Create an Account", isAuth: false });
};

exports.postSignup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const confirmedPassword = req.body.confirmPassword;

    let user = await User.findOne({ email: email });
    if (user) {
      res.redirect("/signup");
    }
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });

      user.save();
    }

    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};
