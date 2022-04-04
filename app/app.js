import { config } from "dotenv";
config();
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";
import fileUpload from 'express-fileupload'

import express from "express";
import compression from "compression";
import helmet from "helmet";
import lusca from "lusca";
import flash from "flash";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";

import routers from "./routes/routes.js";
import * as errorHandlers from "./middleware/errorHandler.js";

const app = express();
const mongoUrl = process.env.MONGODB_URL.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);
const session_secret = process.env.SESSION_SECRET;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const environment = process.env.ENVIRONMENT;

//setting all middleware
app.enable("trust proxy");
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles:true
}))
app.use(cookieParser());
app.use(compression());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization,x-auth-token, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    return next();
  }
});

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: session_secret,
    store: MongoStore.create({
      mongoUrl,
      autoRemove: "native",
    }),
  })
);

app.use(helmet());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Here our API Routes
app.use(routers);

if (environment === "production") {
  app.use(cors());
  app.options("*", cors());
  app.use(express.static(path.join(__dirname, "../../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../../client", "build", "index.html")
    );
  });
} else {
  app.use(
    cors({
      origin: process.env.BASE_CLIENT_URL,
    })
  );
  app.use(morgan("dev"));
  app.use(express.static(path.join(__dirname, "../../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../../client", "build", "index.html")
    );
  });
}
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (environment === "development") {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

export default app;
