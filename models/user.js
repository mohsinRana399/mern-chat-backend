const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      unique: false,
    },
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    isOnline: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", UserSchema);

module.exports = {
  User,
};
