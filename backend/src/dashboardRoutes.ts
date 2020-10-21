import { Router } from "express";
import multer from "multer";

import AuthMiddleware from "./middlewares/auth";

import uploadConfig from "./config/upload";
import UsersController from "./controllers/UsersController";
import AuthController from "./controllers/AuthController";

const router = Router();
const upload = multer(uploadConfig);

router.post("/authenticate", AuthController.authenticate);
router.post("/users", UsersController.create);

router.use(AuthMiddleware);

router.get("/users", UsersController.index);

export default router;
