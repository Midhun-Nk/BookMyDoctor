import express from "express";

import { addDoctor, loginAdmin } from "../controllers/admin_controller.js";

import upload from "../middlewares/multer.js";

import authAdmin from "../middlewares/authAdmin.js";
import { allDoctors } from "../controllers/admin_controller.js";
const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
import { changeAvailability } from "../controllers/doctor_controller.js";
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/login", loginAdmin);

adminRouter.post("/change-availability", authAdmin, changeAvailability);
export default adminRouter;
