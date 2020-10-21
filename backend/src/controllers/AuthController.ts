import { Request, Response } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcrypt";

import { generateToken } from "../utils/jwt";

import User from "../models/User";

export default {
  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;

    const repository = getRepository(User);

    const user = await repository.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found." });

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return res.status(401).json({ error: "Invalid password." });

    return res
      .status(200)
      .send({ user, token: generateToken({ id: user.id }) });
  },
};
