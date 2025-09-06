import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({
      success: true,
      message: "Doctor availability updated successfully.",
    });
  } catch (error) {
    console.error("❌ Change Availability Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("❌ Doctor List Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("❌ Appointments Admin Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, message: "Login successful", token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("❌ Login Doctor Error:", error);
    res.json({ success: false, message: error.message });
  }
};

//api to get doctor appointments for doctor panel
export const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.docId; // ✅ comes from middleware
    const appointments = await appointmentModel.find({ docId });
    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("❌ Appointments Doctor Error:", error);
    res.json({ success: false, message: error.message });
  }
};

//api to mark appointment complete

export const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body; // only take appointmentId from body
    const docId = req.docId; // ✅ comes from middleware
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({
        success: true,
        message: "Appointment marked as completed.",
      });
    } else {
      return res.json({
        success: false,
        message: "You are not authorized to complete this appointment.",
      });
    }
  } catch (error) {
    console.error("❌ Appointment Complete Error:", error);
    res.json({ success: false, message: error.message });
  }
};

//api to mark appointment cancel

export const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body; // only take appointmentId from body
    const docId = req.docId; // ✅ comes from middleware
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({
        success: true,
        message: "Appointment marked as cancelled.",
      });
    } else {
      return res.json({
        success: false,
        message: "You are not authorized to cancel this appointment.",
      });
    }
  } catch (error) {
    console.error("❌ Appointment Cancel Error:", error);
    res.json({ success: false, message: error.message });
  }
};

//Api to get Dashbord data for doctor panel

export const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId; // ✅

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });
    let patients = [];
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      appointments: appointments.length,
      earnings,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, data: dashData });
  } catch (error) {
    console.error("❌ Doctor Dashboard Error:", error);
    res.json({ success: false, message: error.message });
  }
};
