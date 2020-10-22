import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { generateToken } from "../utils/jwt";
import mailer from "../services/mailer";

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

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const repository = getRepository(User);

      const user = await repository.findOne({ email });

      if (!user) return res.status(404).json({ error: "User not found." });

      const token = crypto.randomBytes(20).toString("hex");

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ password_reset_token: token, password_reset_expires: now })
        .where("id = :id", { id: user.id })
        .execute();

      await mailer.sendMail({
        to: email,
        from: "vagner@email.com",
        subject: "Forgot Password",
        html: "../resources/mail/auth/forgotPasswordTemplate.html",
      });

      return res.send();
    } catch (error) {
      res.status(400).send({ error: "Error on forgot password, try again" });
    }
  },
};
