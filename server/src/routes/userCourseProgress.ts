import express from "express";
import { GetUserCourseProgress, UpdateUserCourseProgress, useGetUserEnrolledCourses } from "../controllers/userCourseProgressController";

const router = express.Router()
// course progress 

router.get('/:userId/enrolled-courses',useGetUserEnrolledCourses)
router.get('/:userId/courses/:courseId',GetUserCourseProgress)
router.put('/:userId/courses/:courseId',UpdateUserCourseProgress)



export default router