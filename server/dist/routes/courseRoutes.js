"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const router = express_1.default.Router();
// courses 
router.get('/', courseController_1.listCourses);
router.get('/:courseId', courseController_1.getCourse);
exports.default = router;