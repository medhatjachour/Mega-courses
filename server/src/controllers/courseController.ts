import { Request, Response } from "express";
import Course from "../models/courseModel";
import { v4 as uuidV4 } from 'uuid'
import { getAuth } from "@clerk/express";
import AWS from 'aws-sdk'



const s3 = new AWS.S3()

export const getUploadVideoURl = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {fileName , fileType} = req.body;
    if(!fileName||!fileType){
        res.status(400).json({message:"file name and type are required"})
        return;
    }
    try{
        const uniqueId = uuidV4()
        const s3Key = `videos/${uniqueId}/${fileName}`
        const s3Params = {
            Bucket: process.env.S3_BUCKETS_NAME||"",
            key : s3Key,
            Expires:60,
            ContentType:fileType
        }
        const uploadUrl = s3.getSignedUrl('putObject',s3Params)
        const videoIel = `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqueId}${fileName}`
        res.json({ message: "Upload Url Generated successfully", data: {uploadUrl,videoIel} })

    }catch (e){
        res.status(500)
        res.json({ message: "error retrieving courses ", e })
    }
}
 

export const listCourses = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { category } = req.query;
    try {
        const courses = category && category !== "all" ? await Course.scan("category").eq(category).exec() : await Course.scan().exec()
        res.json({ message: "success", data: courses })
    }
    catch (error) {
        res.status(500)
        res.json({ message: "error retrieving courses ", error })
    }
}

export const getCourse = async (
    req: Request,
    res: Response
): Promise<void> => {

    const { courseId } = req.params;
    try {
        const course = await Course.get(courseId)
        if (!course) {
            res.status(404).json({ message: "not found" })
            return
        }
        res.json({ message: "success", data: course })
    }
    catch (error) {
        res.status(500)
        res.json({ message: "error retrieving course ", error })
    }
}

export const createCourse = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {
        const { teacherId, teacherName } = req.body;
        if (!teacherId || !teacherName) {
            res.status(400).json({ message: "Teacher id and name are reaquired" })
            return
        }
        const newCourse = new Course({
            courseId: uuidV4(),
            teacherId,
            teacherName,
            title: "untitled",
            description: "",
            category: "unCategorized",
            image: "",
            price: 0,
            level: "Beginner",
            status: "Draft",
            sections: [],
            enrollments: [],
        })
        await newCourse.save()
        res.json({ message: "created course successfully", data: newCourse })
    }
    catch (error) {
        res.status(500)
        res.json({ message: "error creating course   ", error })
    }
}


export const updateCourse = async (
    req: Request,
    res: Response
): Promise<void> => {

    const { courseId } = req.params;
    const updateData = { ...req.body };
    const { userId } = getAuth(req)
    try {

        const course = await Course.get(courseId)
        if (!course) {
            res.status(404).json({ message: "course not found" })
            return
        }
        if (course.teacherId !== userId) {
            res.status(403).json({ message: "Not authorized to update" })
            return
        }

        if (updateData.price) {
            const priceT = parseInt(updateData.price)
            updateData.price = priceT
            if (isNaN(priceT)) {
                res.status(404).json({ message: "invalid price", error: "price must be number" })
                return
            }
        }
        if (updateData.sections) {
            const sectionsData = typeof updateData.sections === "string" ? JSON.parse(updateData.sections) : updateData.sections
            updateData.sections = sectionsData.map((section: any) => ({
                ...section,
                sectionId: section.sectionId || uuidV4(),
                chapters: section.chapters.map((chapter: any) => ({
                    ...chapter,
                    chapterId: chapter.chapterId || uuidV4()
                }))
            }))

        }
        Object.assign(course, updateData)
        await course.save()
        res.json({ message: "updated course successfully", data: course })
    }
    catch (error) {
        res.status(500)
        res.json({ message: "error updating course   ", error })
    }
}


export const deleteCourse = async (
    req: Request,
    res: Response
): Promise<void> => {

    const { courseId } = req.params;
    const { userId } = getAuth(req)
    try {
        const course = await Course.get(courseId)
        if (!course) {
            res.status(404).json({ message: "course not found" })
            return
        }
        if (course.teacherId !== userId) {
            res.status(403).json({ message: "Not authorized to update" })
            return
        }
        await Course.delete(courseId)
        res.json({ message: "deleted successfully" })
    }
    catch (error) {
        res.status(500)
        res.json({ message: "error deleting course ", error })
    }
}
