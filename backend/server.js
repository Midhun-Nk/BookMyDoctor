import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoutes.js";

//app config
const app = express();

const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();
//middlewares

app.use(express.json());
app.use(cors());

//api endpoints

app.use("/api/admin", adminRouter);

//localhost/api/admin/add-doctor

app.get("/", (req, res) => {
  res.send("Api Working");
});

app.listen(port, () => {
  console.log("Server is Running at", port);
  console.log("http://localhost:4000/");
});
