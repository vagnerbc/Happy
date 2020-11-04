import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Orphanage from "../models/Orphanage";

export default {
  async findPendingOrphanages(req: Request, res: Response) {
    const repository = getRepository(Orphanage);

    const orphanages = await repository.find({
      select: ["id", "name", "latitude", "longitude"],
      where: { approved: false },
    });

    res.status(201).send(orphanages);
  },

  async findApprovedOrphanages(req: Request, res: Response) {
    const repository = getRepository(Orphanage);

    const orphanages = await repository.find({
      select: ["id", "name", "latitude", "longitude"],
      where: { approved: true },
    });

    res.status(201).send(orphanages);
  },
};
