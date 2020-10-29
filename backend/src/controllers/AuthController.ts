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

    try {
      const repository = getRepository(User);

      const user = await repository.findOne({ email });

      if (!user) return res.status(404).json({ error: "E-mail not found." });

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) return res.status(401).json({ error: "Invalid password." });

      const data = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      return res
        .status(200)
        .send({ user: data, token: generateToken({ id: user.id }) });
    } catch (error) {
      return res.status(400).send({ error: "Error on login." });
    }
  },

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const repository = getRepository(User);

      const user = await repository.findOne({ email });

      if (!user) return res.status(404).json({ error: "E-mail not found." });

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
        html: `<p>Você esqueceu sua senha ? Não tem problema, utilize esse token ${token}`,
      });

      return res.send();
    } catch (error) {
      return res
        .status(400)
        .send({ error: "Error on forgot password, try again" });
    }
  },

  async resetPassword(req: Request, res: Response) {
    const { email, token, password } = req.body;

    try {
      const repository = getRepository(User);

      const user = await repository.findOne({
        email,
      });

      if (!user) return res.status(400).send({ error: "Email not found." });

      if (
        user.password_reset_expires < new Date() ||
        user.password_reset_token !== token
      )
        return res
          .status(400)
          .send({ error: "Token expired to reset password." });

      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ password })
        .where("id = :id", { id: user.id })
        .execute();

      return res.send();
    } catch (error) {
      return res.status(400).send({ error: "Error on reset password." });
    }
  },
};
