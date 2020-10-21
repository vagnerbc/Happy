import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET ?? "";

export const generateToken = (param: { id: number }) => {
  return jwt.sign(param, SECRET, {
    expiresIn: 86400,
  });
};
