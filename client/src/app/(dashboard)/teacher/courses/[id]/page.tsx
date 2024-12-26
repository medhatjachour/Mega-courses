"use client"
import { CustomFormField } from "@/components/CustomFormField";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { courseSchema } from "@/lib/schemas";
import {
  centsToDollars,
  createCourseFormData,
  uploadAllVideos,
} from "@/lib/utils";
import { openSectionModal, setSections } from "@/state";
import { useGetCourseQuery, useGetUploadVideoUrlMutation, useUpdateCourseMutation } from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import DroppableComponent from "./Droppable";
import ChapterModel from "./ChapterModel";
import SectionModel from "./SectionModel";

const CourseEditor = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data: course, isLoading, isError } = useGetCourseQuery(id);
  const [updateCourse] = useUpdateCourseMutation();
  // upload video
const [getUploadVideoURl] = useGetUploadVideoUrlMutation()

  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.global.courseEditor);

  const methods = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseTitle: "",
      courseDescription: "",
      courseCategory: "",
      coursePrice: "0",
      courseStatus: false,
    },
  });

  useEffect(() => {
    if (course) {
      methods.reset({
        courseTitle: course.title,
        courseDescription: course.description,
        courseCategory: course.category,
        coursePrice: centsToDollars(course.price),
        courseStatus: course.status === "Published",
      });
      dispatch(setSections(course.sections || []));
    }
  }, [course]);

// }, [course, methods]);
  const onSubmit = async (data: CourseFormData) => {
    try {

      const updatedSection = await uploadAllVideos(
        sections,
        id,
        getUploadVideoURl
      )

      const formData = createCourseFormData(data, updatedSection);

      const UpdatedCourse = await updateCourse({
        courseId: id,
        formData,
      }).unwrap();
      // await uploadAllVideos(sections , updateCourse.sections,id, uploadVideo)
      // router.refresh();
    } catch (e) {
      console.log("failed to update", e);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-5 mb-5">
        <button className="flex items-center border border-customgreys-darkGrey rounded-lg p2 gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </button>
      </div>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Header
            title="Course Setup"
            subtitle="Complete all fields and ave your course "
            rightElement={
              <div className="flex items-center space-x-4">
                <CustomFormField
                  name="courseStatus"
                  label={methods.watch("courseStatus") ? "Published" : "Draft"}
                  type="switch"
                  className="flex items-center space-x-2 "
                  labelClassName={`text-sm font-medium ${
                    methods.watch("courseStatus")
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                  inputClassName="data-[state=checked]:bg-green-500"
                />
                <Button>
                  {methods.watch("courseStatus")
                    ? "Update Published Course"
                    : "Save Draft"}
                </Button>
              </div>
            }
          />
          <div className="flex justify-between md:flex-row flex-col gap-9 mt-5 font-dm-sans">
            <div className="basis-1/2">
              <div className="space-y-4">
                <CustomFormField
                  name="courseTitle"
                  label="Course Title"
                  type="text"
                  placeholder="write your course title here"
                  className="border-none"
                  initialValue={course?.title}
                />
                <CustomFormField
                  name="courseDescription"
                  label="Course Description"
                  type="textarea"
                  placeholder="write your course Description here"
                  // className="border-none"
                  initialValue={course?.description}
                />

                <CustomFormField
                  name="courseCategory"
                  label="Course Category"
                  type="select"
                  placeholder="write your course Category here"
                  options={[
                    { value: "technology", label: "Technology" },
                    { value: "science", label: "Science" },
                    { value: "mathematics", label: "Mathematics" },
                    {
                      value: "Artificial Intelligence",
                      label: "Artificial Intelligence",
                    },
                  ]}
                  initialValue={course?.category}
                />

                <CustomFormField
                  name="coursePrice"
                  label="Course Price"
                  type="textarea"
                  placeholder="write your course Price here"
                  // className="border-none"
                  initialValue={course?.price}
                />
              </div>
            </div>
            <div className="bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold text-secondary-foreground">
                  Sections
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    dispatch(openSectionModal({ sectionIndex: null }))
                  }
                  className="border-none text-primary-700 group"
                >
                  <Plus className="mr-1 h-4 w-4 group-hover:white-100" />
                  <span className="text-primary-700 group-hover:white-100">
                    Add Section
                  </span>
                </Button>
              </div>
              {isLoading ? (
                <p>Loading Course Content...</p>
              ) : sections.length > 0 ? (
                <DroppableComponent/>
              ) : (
                <p>No Sections Available</p>
              )}
            </div>
          </div>
        </form>
      </Form>
            
            <ChapterModel/>
            <SectionModel/>
      
    </div>
  );
};

export default CourseEditor;
