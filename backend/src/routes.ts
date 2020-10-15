import { Router } from "express";
import multer from "multer";

import uploadConfig from "./config/upload";
import OrphanagesController from "./controllers/OrphanatesController";

const router = Router();
const upload = multer(uploadConfig);

router.get("/", (req, res) => {
  res.json({ message: "Happy" });
});

router.get("/orphanages", OrphanagesController.index);
router.get("/orphanages/:id", OrphanagesController.show);
router.post("/orphanages", upload.array("images"), OrphanagesController.create);

export default router;