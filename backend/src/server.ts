import express from "express";
import path from "path";
import cors from "cors";
import * as dotenv from "dotenv";

import "express-async-errors";

import "./database/connection";

import router from "./routes";
import errorHandler from "./errors/handler";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(errorHandler);

app.listen(process.env.PORT ?? 3333);
