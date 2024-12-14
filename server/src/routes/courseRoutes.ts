import express from "express";
import { getCourse, listCourses } from "../controllers/courseController";

const router = express.Router()

// courses 
router.get('/',listCourses)
router.get('/:courseId',getCourse)


export default router