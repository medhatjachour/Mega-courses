"use client"
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import TeacherCourseCard from "@/components/TeacherCourseCard";
import Toolbar from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
} from "@/state/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const Courses = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    data: courses,
    isLoading,
    isError,
  } = useGetCoursesQuery({ category: "all" });
  const [createCourse] = useCreateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses.filter((course) => {
      const matchedSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLocaleLowerCase());
      const matchedCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      return matchedSearch && matchedCategory;
    });
  }, [courses, selectedCategory, searchTerm]);

//   unwrap: This function is provided by Redux Toolkit. When you call unwrap() on a dispatched asynchronous action, it returns a promise that resolves to the action's payload if the action was fulfilled, or it rejects with the action's error if the action was rejected. This allows you to handle the action's result in a more fine-grained way, similar to using async/await with try/catch.

  const handleEdit = (course: Course) => {
    router.push(`/teacher/courses/${course.courseId}`,{
      scroll:false,
    });
  };

  const handleDelete = async (course: Course) => {
    if (window.confirm("Are you sure you want to delete this course")) {
      await deleteCourse(course.courseId).unwrap();
    }
  };

  const handleCreateCourse = async()=>{
    if(!user) return;
    const result = await createCourse({
        teacherId:user.id,
        teacherName : user.fullName||"Unknown Teacher",
    }).unwrap();
    router.push(`/teacher/courses/${result.courseId}`,{
      scroll:false,
    });
  }

  if(isLoading) return <Loading/>
  if(isError || !courses) return <div>something went wrong</div>

  return <div className="teacher-courses">
    <Header
        title="Courses"
        subtitle="Browse Your Courses"
        rightElement={
            <Button
            className="teacher-courses__header"
                onClick={handleCreateCourse}
            >
                Create Course
            </Button>
        }
    />
    <Toolbar
        onSearch = {setSearchTerm}
        onCategoryChange = {setSelectedCategory}
    />
    <div className="teacher-courses__grid">
        {filteredCourses.map((course)=>(
            <TeacherCourseCard
                key={course.courseId}
                course= {course}
                onEdit = {handleEdit}
                onDelete = {handleDelete}
                isOwner = {course.teacherId === user?.id}
            />  
        ))}
    </div>
  </div>;
};

export default Courses;
