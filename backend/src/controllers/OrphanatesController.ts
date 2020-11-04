import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as Yup from "yup";

import Orphanage from "../models/Orphanage";
import OrphanageView from "../views/orphanages_view";

export default {
  async show(req: Request, res: Response) {
    const { id } = req.params;
    const repository = getRepository(Orphanage);

    const orphanage = await repository.findOneOrFail(id, {
      relations: ["images"],
    });

    return res.status(201).send(OrphanageView.render(orphanage));
  },

  async index(req: Request, res: Response) {
    const repository = getRepository(Orphanage);

    const orphanages = await repository.find({
      relations: ["images"],
      where: { approved: true },
    });

    return res.status(201).send(OrphanageView.renderMany(orphanages));
  },

  async create(req: Request, res: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } = req.body;

    const reqImages = req.files as Express.Multer.File[];
    const images = reqImages.map((image) => {
      return { path: image.filename };
    });

    const repository = getRepository(Orphanage);

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === "true",
      images,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required(),
        })
      ),
    });

    await schema.validate(data, {
      abortEarly: false,
    });

    const orphanage = repository.create(data);

    await repository.save(orphanage);

    return res.status(201).send(orphanage);
  },

  async approve(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const repository = getRepository(Orphanage);

      const orphanage = await repository.findOne(id);

      if (!orphanage)
        return res.status(401).send({ message: "Orphanage does not exist!" });

      orphanage.approved = true;

      repository.save(orphanage);

      return res.status(200).send();
    } catch (error) {
      return res
        .status(401)
        .send({ message: "Error on approve this orphanage" });
    }
  },

  async reject(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const repository = getRepository(Orphanage);

      const orphanage = await repository.findOne(id);

      if (!orphanage)
        return res.status(401).send({ message: "Orphanage does not exist!" });

      orphanage.approved = true;

      repository.save(orphanage);

      return res.status(200);
    } catch (error) {
      return res
        .status(401)
        .send({ message: "Error on approve this orphanage" });
    }
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    try {
      const repository = getRepository(Orphanage);

      await repository.delete(id);

      return res.status(200).send();
    } catch (error) {
      return res
        .status(401)
        .send({ message: "Error on delete this orphanage" });
    }
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } = req.body;

    const reqImages = req.files as Express.Multer.File[];
    const images = reqImages.map((image) => {
      return { path: image.filename };
    });

    const repository = getRepository(Orphanage);

    const data = {
      id: parseInt(id),
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === "true",
      images,
    };

    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required(),
        })
      ),
    });

    await schema.validate(data, {
      abortEarly: false,
    });

    await repository.save(data);

    return res.status(201).send(data);
  },
};
