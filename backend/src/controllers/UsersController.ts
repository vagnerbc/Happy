import { Request, Response } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcrypt";
import * as Yup from "yup";

import { generateToken } from "../utils/jwt";
import UserView from "../views/users_view";
import User from "../models/User";

export default {
  async index(req: Request, res: Response) {
    const repository = getRepository(User);

    const users = await repository.find();

    res.status(200).json(UserView.renderMany(users));
  },

  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    await schema.validate(
      {
        name,
        email,
        password,
      },
      {
        abortEarly: false,
      }
    );

    const repository = getRepository(User);

    const userCreated = await repository.findOne({ email });

    if (userCreated)
      return res.status(400).json({ error: "User already exists." });

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    const user = repository.create({
      name,
      email,
      password: hash,
    });

    repository.save(user);

    return res.status(201).json({
      user,
      token: generateToken({ id: user.id }),
    });
  },
};
