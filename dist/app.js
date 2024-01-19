"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
// import compression from 'compression';
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importStar(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const express_1 = __importDefault(require("express"));
const appError_1 = __importDefault(require("./Utilities/Errors/appError"));
const errorMiddleware_1 = require("./Middlewares/Errors/errorMiddleware");
const index_1 = __importDefault(require("./Routes/index"));
dotenv_1.default.config();
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("UNCAUGHT EXCEPTION! shutting down...");
    process.exit(1);
});
mongoose_1.default.set("debug", true);
mongoose_1.default.Promise = global.Promise;
const database = String(process.env.MONGO_DB_URL);
// Initialize express
const app = (0, express_1.default)();
// Port
const PORT = Number(process.env.PORT) || 3000;
const address = `0.0.0.0:${PORT}`;
// compression middleware
// app.use(compression());
// set security Http headers
app.use((0, helmet_1.default)());
app.options("*", (0, cors_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
// Body parser middleware
// body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: false }));
// Data sanitization against noSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
// prevent parameter pollution
app.use((0, hpp_1.default)({}));
// Define index route
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // res.render('index');
    res.contentType("json");
    res.json({ status: "ok", message: "Welcome to VOTA-SERVER" });
}));
// Routes
app.use("/api/v1", index_1.default);
app.all("*", (req, res, next) => {
    next(new appError_1.default(`can't find ${req.originalUrl} on server!`, 404));
});
app.use(errorMiddleware_1.errorHandler);
// Listen for server connections
const server = app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    function run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, mongoose_1.connect)(database);
                console.log(`Connection to database successful ${database}`);
                console.log(`Server started on PORT https://localhost:${address}`);
            }
            catch (error) {
                console.log(`Trouble connecting to Database with error: ${error}`);
            }
        });
    }
    run().catch(console.dir);
}));
process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION! shutting down...");
    server.close(() => {
        process.exit(1);
    });
});
exports.default = server;
