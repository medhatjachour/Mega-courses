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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.clerkClient = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dynamoose = __importStar(require("dynamoose"));
const seedDynamodb_1 = __importDefault(require("./seed/seedDynamodb"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const userClerkRoutes_1 = __importDefault(require("./routes/userClerkRoutes"));
const transactionsRoutes_1 = __importDefault(require("./routes/transactionsRoutes"));
const userCourseProgress_1 = __importDefault(require("./routes/userCourseProgress"));
const express_2 = require("@clerk/express");
// route imports 
// config
dotenv_1.default.config();
const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
    dynamoose.aws.ddb.local();
}
exports.clerkClient = (0, express_2.createClerkClient)({
    secretKey: process.env.CLERK_SECRET_KEY
});
const app = (0, express_1.default)();
// This middleware parses incoming requests with JSON payloads. It's a built-in middleware in Express and is based on body-parser
app.use(express_1.default.json());
// Helmet helps secure your Express apps by setting various HTTP headers. This line includes several security middleware functions provided by Helmet.
app.use((0, helmet_1.default)());
// This line configures the Cross-Origin Resource Policy (CORP) to allow cross-origin requests. It's a part of Helmet to handle security around resource sharing.
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
// Morgan is a middleware for logging HTTP requests and responses. The "common" format provides a standard predefined logging format.
app.use((0, morgan_1.default)("common"));
// This middleware parses incoming requests with JSON payloads, specifically using the body-parser library, even though express.json() does this by default now
app.use(body_parser_1.default.json());
// This middleware parses incoming requests with URL-encoded payloads (form data). The extended: false option ensures that the query string library is used
app.use(body_parser_1.default.urlencoded({ extended: false }));
// This middleware enables Cross-Origin Resource Sharing (CORS) for your application, allowing it to handle requests from different origins.
app.use((0, cors_1.default)());
// 
app.use((0, express_2.clerkMiddleware)());
// routes
app.get("/", (req, res) => {
    res.send("hello world");
});
app.use("/courses", courseRoutes_1.default);
app.use("/users/clerk", (0, express_2.requireAuth)(), userClerkRoutes_1.default);
app.use("/transactions/", (0, express_2.requireAuth)(), transactionsRoutes_1.default);
app.use("/users/course-progress", (0, express_2.requireAuth)(), userCourseProgress_1.default);
// server
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
if (!isProduction) {
    app.listen(port, () => {
        console.log(`running on port ${port}`);
    });
}
// aws production
const serverlessApp = (0, serverless_http_1.default)(app);
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    if (event.action === "seed") {
        yield (0, seedDynamodb_1.default)();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "data seeded successfully " })
        };
    }
    else {
        return serverlessApp(event, context);
    }
});
exports.handler = handler;
