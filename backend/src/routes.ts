import { Router } from "express";
import multer from "multer";

import uploadConfig from "./config/upload";
import AuthController from "./controllers/AuthController";
import OrphanagesController from "./controllers/OrphanatesController";
import UsersController from "./controllers/UsersController";

import AuthMiddleware from "./middlewares/auth";

const router = Router();
const upload = multer(uploadConfig);

router.get("/", (req, res) => {
  res.json({ message: "Happy" });
});

router.post("/authenticate", AuthController.authenticate);
router.post("/forgot_password", AuthController.forgotPassword);
router.post("/reset_password", AuthController.resetPassword);

router.get("/orphanages", OrphanagesController.index);
router.get("/orphanages/:id", OrphanagesController.show);
router.post("/orphanages", upload.array("images"), OrphanagesController.create);

router.post("/users", UsersController.create);

router.use(AuthMiddleware);

router.get("/users", UsersController.index);

export default router;
