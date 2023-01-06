const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { User } = require("../models/user");
const errorCaught = require("../utils/error_handler");

const encrypt = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
const compare = async (password, passwordToCheck) => {
  return await bcrypt.compare(password, passwordToCheck);
};
const createToken = (payload) => {
  return new Promise((res, rej) => {
    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) return rej(err);
      return res(token);
    });
  });
};

// Registration
router.post("/register", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    console.log({ name, username, password });
    const user = await User.findOne({ username: username.toLowerCase() });
    if (user) return res.status(400).json({ message: "User Already Exists" });

    const hashed_password = password && (await encrypt(password));
    const _user = new User({
      username: username.toLowerCase(),
      password: hashed_password,
      name,
      isOnline: true,
    });
    await _user.save();

    const token = await createToken({
      user: { id: _user._id, type: "user" },
    });
    return res.status(200).json({
      user: _user,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    return errorCaught(res, error);
  }
});

//Login
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log("signing in...");
    const user = await User.findOne({
      username: username.toLowerCase(),
    });

    if (!user)
      return res
        .status(403)
        .json({ message: "There is no account registered with this username" });
    const isMatched = await compare(password, user?.password);
    if (!isMatched)
      return res.status(403).json({ message: "Incorrect Password" });

    const token = await createToken({
      user: { id: user._id, type: "user" },
    });

    return res.status(200).json({
      user,
      token,
      message: "User Logged in successfully",
    });
  } catch (error) {
    return errorCaught(res, error);
  }
});
//getAllUsers
router.get("/getAll", async (req, res) => {
  try {
    const allUsers = await User.find();
    return res.status(200).json({
      allUsers,
      message: "here you go...",
    });
  } catch (error) {
    return errorCaught(res, error);
  }
});
module.exports = router;
