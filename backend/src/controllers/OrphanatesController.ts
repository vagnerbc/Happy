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

    return res.json(OrphanageView.render(orphanage));
  },

  async index(req: Request, res: Response) {
    const repository = getRepository(Orphanage);

    const orphanages = await repository.find({
      relations: ["images"],
    });

    return res.json(OrphanageView.renderMany(orphanages));
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

    return res.status(201).json(orphanage);
  },
};
