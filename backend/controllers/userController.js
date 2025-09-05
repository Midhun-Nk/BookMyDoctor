//api to register user
import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import { v2 } from "cloudinary";
const cloudinary = v2;
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Razorpay from "razorpay";
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

//Api to Book Appointment

export const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor is not available." });
    }

    let slots_booked = docData.slots_booked;

    //checking for avaibality
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot is already booked." });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    };
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    //save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment booked successfully." });
  } catch (error) {
    console.error("❌ Book Appointment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listAppointment = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ comes from auth middleware
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("❌ List Appointment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user.id; // ✅ comes from auth middleware

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    if (appointmentData.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId).select("-password");

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (time) => time !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment canceled successfully." });
  } catch (error) {
    console.error("❌ Cancel Appointment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//api to make the payment razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const paymentRazorPay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment not found." });

      //Creating options for razor pay payment
    }
    const options = {
      amount: appointmentData.amount * 100, // amount in the smallest currency unit
      currency: process.env.CURRENCY || "INR",

      receipt: appointmentId,
    };

    //creation of an order
    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Razorpay Payment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//api to verify payment

export const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        $set: { payment: true },
      });
      return res.json({
        success: true,
        message: "Payment verified successfully.",
      });
    } else {
      return res.json({ success: false, message: "Payment not verified." });
    }
  } catch (error) {
    console.error("❌ Razorpay Verification Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
