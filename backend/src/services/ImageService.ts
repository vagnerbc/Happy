import { getRepository } from "typeorm";
import path from "path";
import fs from "fs";

import Orphanage from "../models/Orphanage";
import Image from "../models/Image";

export default {
  async delete(orphanage: Orphanage) {
    try {
      const repository = getRepository(Image);

      const images = await repository.find();

      await repository.delete({ orphanage });

      await Promise.all(
        images.map(async (image) => {
          fs.unlink(path.resolve("uploads", image.path), () => {});
        })
      );
    } catch (error) {}
  },

  async deleteByOrphanageID(orphanageID: number) {
    try {
      const repository = getRepository(Orphanage);

      const orphanage = await repository.findOne({ id: orphanageID });

      if (!orphanage) return;

      await this.delete(orphanage);
    } catch (error) {}
  },
};
