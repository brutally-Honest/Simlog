const User = require("../models/user-model");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersCltr = {};

usersCltr.signup = async (req, res) => {
  const { body } = req;
  if (body.role == "admin" ||body.role==="moderator") body.role = "user";
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(404).json(errors.array());
  try {
    const salt = await bcryptjs.genSalt();
    body.password = await bcryptjs.hash(body.password, salt);
    const user = new User(body);

    const userCount = await User.countDocuments();
    if (userCount == 0) user.role = "admin";

    const savedUser = await user.save();
    res.json(savedUser);
  } catch (e) {
    res.json(e);
  }
};

usersCltr.login = async (req, res) => {
  const { body } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(404).json(errors.array());
  try {
    const user = await User.findOne({ email: body.email });
    if (!user) res.status(404).json("invalid email/password");
    else {
      const compare = await bcryptjs.compare(body.password, user.password);
      if (!compare) res.status(404).json("invalid email/password");
      else {
        const tokenData = { id: user._id, role: user.role };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.json({ token });
      }
    }
  } catch (e) {
    res.json(e);
  }
};


usersCltr.list = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(404).json(err);
  }
};

usersCltr.changeRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(404).json(errors.array());

  if (req.user.id == id) return res.json("You cannot change your own role");
  else {
    try {
      const user = await User.findOneAndUpdate(
        { _id: id },
        { role },
        { new: true }
      );
      res.json(user);
    } catch (e) {
      res.status(500).json(e);
    }
  }
};

usersCltr.deleteUser = async (req, res) => {
  const { id } = req.params;
  if (req.user.id == id) res.json("Suicide is not an option");
  else {
    try {
      const user = await User.findOneAndDelete({ _id: id }, { new: true });
      res.json(user);
    } catch (e) {
      res.json(e);
    }
  }
};

module.exports = usersCltr;
