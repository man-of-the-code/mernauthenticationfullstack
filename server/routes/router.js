const express = require("express");
const router = express.Router();
const userdb = require("../models/userSchema.js");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate.js");
const jwt = require("jsonwebtoken");

//for user registration
router.post("/register", async (req, res) => {
  console.log(req.body);
  const { fname, email, password, cpassword } = req.body;
  if (!fname || !email || !password || !cpassword) {
    res.status(422).json({ status: 422, message: "fill all the details" });
  }
  try {
    const preuser = await userdb.findOne({ email: email });
    if (preuser) {
      res.status(422).json({
        status: 422,
        message: "email already exist",
      });
    } else if (password !== cpassword) {
      res.status(422).json({
        status: 422,
        message: "password and confirm password doesn't match",
      });
    } else {
      const salt = await bcrypt.genSalt(12);
      const hpassword = await bcrypt.hash(password, salt);
      const hcpassword = await bcrypt.hash(cpassword, salt);
      const doc = new userdb({
        fname: fname,
        email: email,
        password: hpassword,
        cpassword: hcpassword,
      });
      const savedDoc = await doc.save();
      res.status(201).json({ status: 201, savedDoc });
    }
  } catch (error) {
    res.status(422).json({ status: 422, message: "user registration failed" });
  }
});

//for user login
router.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ status: 422, message: "fill all the details" });
  }
  try {
    const checkUser = await userdb.findOne({ email: email });
    if (checkUser) {
      const checkPassword = await bcrypt.compare(password, checkUser.password);
      if (!checkPassword) {
        res.status(422).json({ status: 422, message: "invalid credentials" });
      } else {
        const token = jwt.sign({ _id: checkUser._id }, process.env.signature, {
          expiresIn: "1d",
        });
        res.cookie("userdatatoken", token, {
          expires: new Date(Date.now() + 86400000),
          httpOnly: true,
        });
        const result = {
          checkUser,
          token,
        };
        res.status(201).json({ status: 201, result });
      }
    }
  } catch (error) {
    res.status(422).json({ status: 422, message: "user doesn't exist" });
  }
});

//for user validation
router.get("/uservalid", authenticate, async (req, res) => {
  try {
    const validUser = await userdb.findOne({ _id: req.userId });
    res.status(201).json({ status: 201, validUser });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

//for user Logout
router.get("/logout", authenticate, async (req, res) => {
  try {
    req.authorisedUser.tokens = req.authorisedUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });
    res.clearCookie("userdatatoken", { path: "/" });
    req.authorisedUser.save();
    res.status(201).json({ status: 201 });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

module.exports = router;
