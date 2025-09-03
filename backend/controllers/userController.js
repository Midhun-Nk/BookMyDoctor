//api to register user
import validator from "validator";
import bcrypt from "bcrypt";

import userModel from "../models/userModel.js";
import { v2 } from "cloudinary";
const cloudinary = v2;
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
    const isMatch = await bcrypt.compare(password, user.password);

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

//api to get user profile data
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ get from middleware
    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.error("❌ Get Profile Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//api to update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ from auth middleware
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "All fields are required." });
    }

    // Update basic info
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address), // must be valid JSON string
      dob,
      gender,
    });

    // If image uploaded
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "auto",
      });
      await userModel.findByIdAndUpdate(userId, {
        image: imageUpload.secure_url,
      });
    }

    res.json({ success: true, message: "Profile updated successfully." });
  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
