import jwt from "jsonwebtoken";

// admin authentication middleware

const authAdmin = (req, res, next) => {
  try {
    const { atoken } = req.headers;

    if (!atoken) {
      return res.json({ success: true, message: "Not Authenticated" });
    }
    const token_decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    if (
      token_decoded !==
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
    ) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authAdmin;
