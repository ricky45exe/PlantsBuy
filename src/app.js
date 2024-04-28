const express = require("express");
var path = require("path");
const app = express();
var hbs = require("hbs");
require("./db/conn");
var alert = require("alert");
const bcrypt = require("bcrypt");
const session = require("express-session");
app.use(
  session({
    name: "code",
    secret: "something",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
  })
);
const authenticateUser = (req, res, next) => {
  if (req.session.user_id) {
    res.locals.isAuthenticated = true;
    next(); // User is authenticated, proceed to the next middleware or route handler
  } else {
    res.locals.isAuthenticated = false; // Set a local variable to use in views
    next(); // Proceed to the next middleware or route handler
  }
};
const checkauthforforget = (req, res, next) => {
  if (res.locals.isAuthenticated) {
    res.redirect("/");
  } else {
    next();
  }
};
app.use(authenticateUser);
// const session = require("express-session");
// app.use(session({ secret: "mysitesession" }));
const generateOTP = require("./otp/otp");
// const otp = generateOTP();
var vo, snd, ml, fm;
const sessionData = {};
var order = require("./otp/orderid");
var sendmail = require("./mail/email");
var welcomemail = require("./mail/welcome");
var forgetmail = require("./mail/forget");
var nodemailer = require("nodemailer");
const Register = require("./models/registration");
const thankmail = require("./mail/thank");

const port = process.env.PORT || 4500;
const staticpath = path.join(__dirname, "../public");
const imagepath = path.join(__dirname, "../public/images");
const videopath = path.join(__dirname, "../public/videos");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
app.use(express.static(staticpath));
app.use(express.static(imagepath));
app.use(express.static(videopath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
app.get("/", (req, res) => {
  res.render("index");
});
const checkAuthentication = (req, res, next) => {
  if (res.locals.isAuthenticated) {
    // User is already signed in, redirect to home page
    res.redirect("/");
  } else {
    // User is not signed in, proceed to the next middleware or route handler
    next();
  }
};
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error);
  }
};

app.get("/registration", checkAuthentication, (req, res) => {
  res.render("user");
});
app.post("/", async (req, res) => {
  const existingUser = await Register.findOne({ email: req.body.email });

  if (!existingUser) {
    const spassword = await securePassword(req.body.password);
    req.session.userData = {
      name: req.body.name,
      email: req.body.email,
      password: spassword,
    };
    ml = req.body.email;
    const otp = generateOTP();
    sendmail(req.body.name, req.body.email, otp);
    vo = otp;

    res.render("otpverify");
  } else {
    // User already exists
    res.render("user", { userExists: true });
  }
});
app.get("/signout", (req, res) => {
  req.session.destroy(); // Destroy the user session on logout
  res.redirect("/"); // Redirect to the login page after logout
});
app.post("/home", async (req, res) => {
  // verifylogin(req, res);
  try {
    const email = req.body.email;
    const password = req.body.password;
    let edata = await Register.find({
      email: req.body.email,
    });
    const passmatch = await bcrypt.compare(password, edata[0].password);

    if (edata.length > 0 && email === edata[0].email && passmatch) {
      req.session.user_id = edata[0]._id;
      req.session.user_email = edata[0].email;
      req.session.login_success = true;

      res.redirect("/");
      console.log(req.session.user_id);
    } else if (edata.length > 0) {
      res.render("user", { showErrorModal: true });
    } else {
      res.render("user", { showEmailNotExistModal: true });
    }
  } catch (error) {
    console.log(error);
  }
});
app.get("/otp", (req, res) => {
  res.render("otpverify");
});
app.post("/otp", async (req, res) => {
  // let rec = req.query.name;
  snd = `${req.body.digit1}${req.body.digit2}${req.body.digit3}${req.body.digit4}`;
  let msg = otpverify();
  const userdata = req.session.userData;
  if (msg === "otp is verified") {
    const data = new Register(userdata);
    const registered = await data.save();

    req.session.user_id = registered._id;
    req.session.signup_success = true;
    console.log(req.session.user_id);
    res.redirect("/");
    welcomemail(ml);
  } else {
    res.render("otpverify", {
      message: "Invalid OTP! Register again.",
    });
  }

  // let entered_value = `${req.body.digit1}${req.body.digit2}${req.body.digit3}${req.body.digit4}`;
});
const otpverify = () => {
  if (snd === vo) {
    return "otp is verified";
  } else {
    return " invalid otp";
  }
};
app.get("/forget", checkauthforforget, (req, res) => {
  res.render("forget");
});
app.post("/forget", async (req, res) => {
  try {
    const mail = req.body.email;
    fm = mail;
    const userdata = await Register.findOne({ email: mail });
    if (userdata) {
      forgetmail(mail);
      res.render("forget", {
        message: "Check your email for a password reset link.",
      });
    } else {
      res.render("forget", {
        message: "Email is not registered. Please register first.",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
app.get("/reset", (req, res) => {
  res.render("setpass");
});

app.post("/reset", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    const userdata = await Register.findOne({ email: fm });
    const bpassword = await securePassword(password);

    if (password === cpassword) {
      userdata.password = bpassword;
      console.log(bpassword);
      await userdata.save();
      res.redirect("/");
    } else {
      res.render("setpass", {
        message: "Password Incorrect. Enter Password again",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
app.get("/terms", (req, res) => {
  res.render("terms");
});
app.get("/testimony", (req, res) => {
  res.render("testimony");
});
app.get("/billing", (req, res) => {
  res.render("billing");
});
app.get("/thank", (req, res) => {
  const orderid = order();
  const currentDate = new Date();
  const dateOnly = currentDate.toLocaleDateString();

  const [day, month, year] = dateOnly.split("/").map(Number);

  const currentYear = year;
  const currentDateObject = new Date(currentYear, month - 1, day);

  currentDateObject.setDate(currentDateObject.getDate() + 3);

  const threeDaysLater = currentDateObject.toLocaleDateString();
  console.log("Date string after adding 3 days:", threeDaysLater);

  const userEmail = req.session.user_email;

  const signupSuccess = req.session.signup_success;
  const emailToPass = signupSuccess ? ml : userEmail;
  console.log(orderid);
  thankmail(orderid, emailToPass, threeDaysLater);
  res.render("thank", { orderid });
});
app.get("/card", (req, res) => {
  res.render("card");
});
app.get("/cart", (req, res) => {
  res.render("cart");
});

app.get("/indexArchanaP", (req, res) => {
  res.render("indexArchanaP");
});
app.get("/indexRachanaP", (req, res) => {
  res.render("indexRachanaP");
});
app.get("/indexRickyP", (req, res) => {
  res.render("indexRickyP");
});
app.get("/indexArchanaC", (req, res) => {
  res.render("indexArchanaC");
});
app.get("/indexRachanaC", (req, res) => {
  res.render("indexRachanaC");
});
app.get("/indexRickyC", (req, res) => {
  res.render("indexRickyC");
});
app.get("/about-us", (req, res) => {
  res.render("about");
});
app.get("/ourteam", (req, res) => {
  res.render("ourteam");
});

app.listen(port, () => {
  console.log(`serving is running at port ${port}`);
});
