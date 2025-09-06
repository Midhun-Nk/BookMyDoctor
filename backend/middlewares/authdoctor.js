import jwt from "jsonwebtoken";

const authDoctor = (req, res, next) => {
  try {
    const dToken = req.headers.token;

    if (!dToken) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authenticated" });
    }

    const token_decoded = jwt.verify(dToken, process.env.JWT_SECRET);

    // safer than req.body
    req.docId = token_decoded.id;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authDoctor;
