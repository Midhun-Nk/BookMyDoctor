import express from "express";
import { doctorList } from "../controllers/doctor_controller.js";
const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList);

export default doctorRouter;
