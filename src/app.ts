import cors from "cors";
// import compression from 'compression';
import dotenv from "dotenv";
import mongoose, { connect } from "mongoose";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import express, { Application, Request, Response, NextFunction } from "express";
import firebaseDB from "./firebase-config";
import path from "path";

import AppError from "./Utilities/Errors/appError";
import { errorHandler } from "./Middlewares/Errors/errorMiddleware";
import Utilities, { statusCode } from "./Utilities/utils";
const util = new Utilities();
import router from "./Routes/index";

dotenv.config();

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! shutting down...");
  process.exit(1);
});

mongoose.set("debug", true);
mongoose.Promise = global.Promise;
const database = String(process.env.MONGO_DB_URL);

// Initialize express
const app: Application = express();

// Port
const PORT: number = Number(process.env.PORT) || 3000;
const address = `0.0.0.0:${PORT}`;

// compression middleware
// app.use(compression());

// set security Http headers
app.use(helmet());

app.options("*", cors());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://vota-sigma.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// Body parser middleware
// body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));
//DISPLAY STATIC FILES FROM THIS FOLDER
app.use("/images", express.static(path.join(__dirname, "images")));

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// prevent parameter pollution
app.use(hpp({}));

// Define index route
app.get("/", async (req: Request, res: Response) => {
  // res.render('index');
  res.contentType("json");
  res.json({ status: "ok", message: "Welcome to VOTA-SERVER" });
});

// Routes
app.use("/api/v1", router);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`can't find ${req.originalUrl} on server!`, 404));
});

app.use(errorHandler);

// Listen for server connections
const server = app.listen(PORT, async () => {
  async function run() {
    try {
      await connect(database);
      console.log(`Connection to database successful ${database}`);
      firebaseDB
        ? console.log(`Connection to FIREBASE DB successful`)
        : console.log("Connection to FIREBASE DB failed");
      console.log(`Server started on PORT https://localhost:${address}`);
      //RUN THE CRON JOB FOR CHECKING IF EVENT DATE HAS REACHED AND UPDATE EVENT STATUS
      await util.updateEventStatus();
    } catch (error) {
      console.log(`Trouble connecting to Database with error: ${error}`);
    }
  }
  run().catch(console.dir);
});

process.on("unhandledRejection", (err: any) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

export default server;
