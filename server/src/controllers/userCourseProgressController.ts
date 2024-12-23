import { Request ,Response} from "express";
import { getAuth } from "@clerk/express";
import UserCourseProgress from "../models/userCourseProgressModel";
import Course from "../models/courseModel";
import { calculateOverallProgress, mergeSections } from "../utils/utils";

export const useGetUserEnrolledCourses= async(
    req:Request,
    res:Response
) :Promise<void> =>{

    const {userId} = req.params;
    // const auth = getAuth()

    // if(!auth || auth.userId !== userId){
    //     res.status(403).json({message:"Access denied"})
    //     return
    // }
    try{
        const enrolledCourses = await UserCourseProgress.query("userId").eq(userId).exec()
        const coursesIds = enrolledCourses.map((item:any)=>item.courseId)
        const courses = await Course.batchGet(coursesIds)
        res.json({message:"Enrolled Courses retrieved successfully",data:courses})
    }
    catch (error){
        res.status(500)
        res.json({message:"error retrieving Enrolled Courses:",error})
    }

}


export const GetUserCourseProgress= async(
    req:Request,
    res:Response
) :Promise<void> =>{

    const {userId,courseId} = req.params;
    try{
        const Progress = await UserCourseProgress.get({userId,courseId})
 
        res.json({message:"Course Progress retrieved successfully",data:Progress})
    }
    catch (error){
        res.status(500)
        res.json({message:"error retrieving Course Progress :",error})
    }

}



export const UpdateUserCourseProgress= async(
    req:Request,
    res:Response
) :Promise<void> =>{

    const {userId,courseId} = req.params;
    const progressData = req.body
    try{

        let progress = await UserCourseProgress.get({userId,courseId})
        if(!progress){
            progress = new UserCourseProgress({
                userId,
                courseId,
                enrollmentDate:new Date().toISOString(),
                overallProgress:0,
                sections:progressData.sections||[],
                lastAccessedTimestamp:new Date().toISOString() 
            })
        }else{
            progress.sections = mergeSections(
                progress.sections,
                progressData.sections||[]
            )
            progress.lastAccessedTimestamp=new Date().toISOString() 
            progress.overallProgress = calculateOverallProgress(progress.sections)
        }
        await progress.save()

        res.json({message:" ",data:progress})
    }
    catch (error){
        res.status(500)
        res.json({message:"error updating user course progress  :",error})
    }

}