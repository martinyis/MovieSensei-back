import { promisify } from "util";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "./../models/userModel.js";
import { OAuth2Client } from "google-auth-library";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    httpOnly: true,
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const googlelogin = async (req, res) => {
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const { authId } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: authId,
      audience: process.env.CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();
    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
      console.log("signed in");
      createSendToken(existingUser, 200, res);
    } else {
      //get a user4anme as evrythin in email before @
      const username = email.split("@")[0];
      const newUser = await User.create({
        email: email,
        username: username,
        avatarUrl: picture,
        fullname: name,
      });
      console.log("created user");
      createSendToken(newUser, 201, res);
    }
  } catch (err) {
    console.log("sent error");
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const protect = async (req, res, next) => {
  console.log("here");
  console.log(req.body);
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      throw new Error("You are not logged in! Please log in to get access");
    }
    //2) Verification Validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //3) Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      throw new Error("The usere belonging to this token no longer exist");
    }
    req.user = freshUser;
    next();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    //if user is not found
    if (!user) {
      throw new Error("The user belonging to this token no longer exist");
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
