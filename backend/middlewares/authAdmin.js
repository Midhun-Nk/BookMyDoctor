import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = (req, res, next) => {
  try {
    const atoken = req.headers["token"]; // frontend should send { headers: { token: "..." } }

    if (!atoken) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authenticated" });
    }

    const token_decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    // Check if decoded email matches admin email
    if (token_decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    console.log("👉 FILE:", req.file);
    console.log("👉 BODY:", req.body);

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authAdmin;
