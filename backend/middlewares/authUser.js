import jwt from "jsonwebtoken";

// user authentication middleware
const authUser = (req, res, next) => {
  try {
    const token = req.headers["token"]; // frontend should send { headers: { token: "..." } }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authenticated" });
    }

    const token_decoded = jwt.verify(token, process.env.JWT_SECRET);

    // safer: attach to req.user instead of req.body
    req.user = { id: token_decoded.id };

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authUser;
