import path from "path";
import nodemailer from "nodemailer";
import config from "../config/mail";
// tslint:disable-next-line: no-var-requires
const hbs = require("nodemailer-express-handlebars");

const { host, port, user, pass } = config;

const transport = nodemailer.createTransport({
  host,
  port: Number(port),
  auth: {
    user,
    pass,
  },
});

transport.use(
  "compile",
  hbs({
    viewEngine: "handlebars",
    viewPath: path.resolve("./src/resources/mail/"),
    extName: ".html",
  })
);

export default transport;
