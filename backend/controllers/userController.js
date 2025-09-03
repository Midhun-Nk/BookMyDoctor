//api to register user
import validator from "validator";
import bycrypt from "bcrypt";
import userModel from "../models/userModel.js";

import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required." });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format." });
    }

    if (!validator.isStrongPassword(password)) {
      return res.json({
        success: false,
        message:
          "Password must be strong (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 symbol).",
      });
    }
    //Hashing userpassword
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const userData = { name, email, password: hashedPassword };

    const newuser = new userModel(userData);
    const user = await newuser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      message: "User registered successfully.",
      token,
    });
  } catch (error) {
    console.error("❌ Register User Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }
    const isMatch = await bycrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.json({
        success: true,
        message: "User logged in successfully.",
        token,
      });
    } else {
      return res.json({ success: false, message: "Invalid credentials." });
    }
  } catch (error) {
    console.error("❌ Login User Error:", error);
    res.json({ success: false, message: error.message });
  }
};
