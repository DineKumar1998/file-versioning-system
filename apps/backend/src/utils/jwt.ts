import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecretkey";

export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
