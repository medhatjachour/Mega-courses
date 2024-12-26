"use client";
import Loading from "@/components/Loading";
import { useGetCoursesQuery } from "@/state/api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, HTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import CourseCardSearch from "@/components/CourseCardSearch";
import SelectedCourse from "./SelectedCourse";

type MotionDivProps = HTMLMotionProps<"div"> & HTMLAttributes<"div">;
const Search: React.FC<MotionDivProps> = (props) => {
  const searchparams = useSearchParams();
  // here comes the search params error becaus we pass it to the  motion dev in {....props } it's a ts error 
  const id = searchparams.get("id");
  const { data: courses, isLoading, isError } = useGetCoursesQuery({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (courses) {
      if (id) {
        const course = courses.find((c) => c.courseId === id);
        setSelectedCourse(course || courses[0]);
      } else {
        setSelectedCourse(courses[0]);
      }
    }
  }, [courses, id]);
  
  if (isLoading) return <Loading />;
  if (isError || !courses) return <div> failed to load courses </div>;

  const handleCourseClick = (course:Course)=>{
        setSelectedCourse(course)
        router.push(`/search?id=${course.courseId}`,{
          scroll:false,
        })
  }
  const handleEnrollNow = (courseId:string)=>{

    router.push(`/checkout?step=1&id=${courseId}&showSignUp=false`,{
      scroll:false,
    })
}
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="search"
      {...props}
    >
      <h1 className="search__title">List of available courses</h1>
      <h2 className="search__subtitle">{courses.length} courses available </h2>
      <div className="search__content">
        
      <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay:  0.2 }}
              className="search__courses-grid"
              {...props}
            >
                {courses.map((course)=>(
              <CourseCardSearch 
                key={course.courseId}
                course={course}
                isSelected={selectedCourse?.courseId===course.courseId}
                onClick={()=>handleCourseClick(course)}
              />
                ))}
            </motion.div>
            {selectedCourse&&(
                
            <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay:  0.5 }}
            className="search__selected-course"
            {...props}
            >
                <SelectedCourse
                course={selectedCourse}
                handleEnrollNow={handleEnrollNow}
                />
            </motion.div>
            )}
      </div>
    </motion.div>
  );
};

export default Search;
