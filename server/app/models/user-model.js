const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["admin", "author", "moderator", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
