const jwt = require("jsonwebtoken");
const userdb = require("../models/userSchema");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const verifiedToken = jwt.verify(token, process.env.signature);
    const authorisedUser = await userdb.findOne({ _id: verifiedToken._id });
    if (!authorisedUser) {
      throw new Error("user not found");
    }
    req.token = token;
    req.userId = verifiedToken._id;
    req.authorisedUser = authorisedUser;
    next();
  } catch (error) {
    res.status(422).json({ status: 422, message: "unauthorised user", error });
  }
};

module.exports = authenticate;
