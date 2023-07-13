import crypto from "crypto";
import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please tell us your name!"],
    unique: true,
  },
  fullname: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  avatarUrl: {
    type: String,
    default: "https://i.imgur.com/2WZtVXx.png",
  },
  credits: {
    type: Number,
    default: 10,
  },
});

userSchema.pre("save", async function (next) {
  //Only run this function if password was actually modiied
  if (!this.isModified("password")) return next();
  //Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.pre(/^find/, function (next) {
  //this point to current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
