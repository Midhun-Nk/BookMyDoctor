import express from "express";

import {
  addDoctor,
  appointmentCancel,
  loginAdmin,
} from "../controllers/admin_controller.js";

import upload from "../middlewares/multer.js";

import authAdmin from "../middlewares/authAdmin.js";
import { allDoctors } from "../controllers/admin_controller.js";
const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
import {
  appointmentsAdmin,
  changeAvailability,
} from "../controllers/doctor_controller.js";
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/login", loginAdmin);

adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);

export default adminRouter;
