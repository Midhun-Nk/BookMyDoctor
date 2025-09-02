import multer from "multer";
import path from "path";
import fs from "fs";

// configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "uploads");

    // ensure uploads folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // timestamp + extension
  },
});

// initialize multer
const upload = multer({ storage });

export default upload;
